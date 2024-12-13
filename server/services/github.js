const axios = require('axios');
const mongoose = require('mongoose');
const {  getModel } = require('../models/index.schema');
const { generateColumnDefinitions } = require('../helpers/custom-functions');
const githubAPI = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${''}`,
      Accept: 'application/vnd.github.v3+json',
    },
});

const fetchIntegrations = async (request, response) => {
    const integrations = await getModel('githubintegrations').find({ isDeleted: false });
    response.json(integrations);
};

const deleteIntegration = async (request, response) => {
    const { username } = request.params;
    await deleteStoreData(username);
    await getModel('githubintegrations').updateOne({ username }, { $set: { isDeleted: true  } });
    response.status(200).send('Integration removed successfully.');
};

const fetchOrganizations = async () => {
    const response = await githubAPI.get(`/user/orgs`);
    return response.data;
};
  
const fetchRepos = async (org) => {
    const response = await githubAPI.get(`/orgs/${org}/repos`);
    return response.data;
};
  
const fetchCommits = async (org, repo) => {
    const response = await githubAPI.get(`/repos/${org}/${repo}/commits`);
    return response.data;
};
  
const fetchPulls = async (org, repo) => {
    const response = await githubAPI.get(`/repos/${org}/${repo}/pulls?state=all`);
    return response.data;
};
  
const fetchIssues = async (org, repo) => {
    const response = await githubAPI.get(`/repos/${org}/${repo}/issues?state=all`);
    return response.data;
};

const fetchAndStoreData = async (username) => {
    try {
        const organizations = await fetchOrganizations();

        for (const org of organizations) {
            await getModel('organizations').updateOne({ identity: username, name: org.login }, {...{ name: org.login, identity: username, isDeleted: false }, ...org }, { upsert: true });
            const repos = await fetchRepos(org.login);
            for (const repo of repos) {
                delete repo.language; //Patch
                await Repo.updateOne(
                    { identity: username, organization: org.login, name: repo.name },
                    {...{ identity: username, organization: org.login, name: repo.name, isDeleted: false }, ...repo},
                    { upsert: true }
                );
                const commits = await fetchCommits(org.login, repo.name);
                const pulls = await fetchPulls(org.login, repo.name);
                const issues = await fetchIssues(org.login, repo.name);

                for (const commit of commits) {
                    await getModel('commits').updateOne(
                        { identity: username, repo: repo.name, organization: org.login, sha: commit.sha },
                        {...{ identity: username, repo: repo.name, organization: org.login, isDeleted: false }, ...commit},
                        { upsert: true }
                    );
                }

                for (const pull of pulls) {
                    await getModel('pulls').updateOne(
                        { identity: username, repo: repo.name, organization: org.login, id: pull.id },
                        {...{ identity: username, repo: repo.name, organization: org.login, isDeleted: false }, ...pull},
                        { upsert: true }
                    );
                }

                for (const issue of issues) {
                    await getModel('issues').updateOne(
                        { identity: username, repo: repo.name, organization: org.login, id: issue.id },
                        {...{ identity: username, repo: repo.name, organization: org.login, isDeleted: false }, ...issue},
                        { upsert: true }
                    );
                }
            }
        }
        await getModel('githubintegrations').updateOne({ username }, { $set: { lastSynced: new Date(), isSyncing: false  } });
        console.log('Data fetch and storage completed successfully.');
    } catch (error) {
        console.error('Error fetching/storing data:', error);
    }
};

const getData = async (request, response) => {
    try {
        const { page, limit, search, sortField, sortOrder, integrations  } = request.query;
    
        const pipeline = [
          {
            $match: {
              ...search && { $text: { $search: search, isDeleted: false } }, ...{ isDeleted: false }
            },
          },
          {
            $lookup: {
              from: 'organizations',
              localField: 'organization',
              foreignField: 'name',
              pipeline: [{ $match: { identity: integrations, isDeleted: false } }, { $project: { name: 1 } }],
              as: 'organizationDetails',
            },
          },
          {
            $lookup: {
              from: 'commits',
              localField: 'name',
              foreignField: 'repo',
              pipeline: [{ $match: { identity: integrations, isDeleted: false } }, { $count: 'commitCount' }],
              as: 'commitDetails',
            },
          },
          {
            $lookup: {
              from: 'pulls',
              localField: 'name',
              foreignField: 'repo',
              pipeline: [{ $match: { identity: integrations, isDeleted: false } },{ $count: 'pullCount' }],
              as: 'pullDetails',
            },
          },
          {
            $lookup: {
              from: 'issues',
              localField: 'name',
              foreignField: 'repo',
              pipeline: [{ $match: { identity: integrations, isDeleted: false } }, { $count: 'issueCount' }],
              as: 'issueDetails',
            },
          },
          {
            $addFields: {
              organization: { $arrayElemAt: ['$organizationDetails.name', 0] },
              commits: { $arrayElemAt: ['$commitDetails.commitCount', 0] },
              pulls: { $arrayElemAt: ['$pullDetails.pullCount', 0] },
              issues: { $arrayElemAt: ['$issueDetails.issueCount', 0] },
            },
          },
          {
            $project: {
              name: 1,
              organization: 1,
              commits: 1,
              pulls: 1,
              issues: 1,
            },
          },
          {
            $sort: {
              [sortField]: sortOrder === 'asc' ? 1 : -1,
            },
          },
          { $skip: (page - 1) * parseInt(limit) },
          { $limit: parseInt(limit) },
        ];
    
        const data = await getModel('repos').aggregate(pipeline).exec();
        const totalDocuments = search ? await getModel('repos').countDocuments({ $text: { $search: search } }) : await getModel('repos').estimatedDocumentCount();
    
        response.json({
          data,
          totalDocuments,
          totalPages: Math.ceil(totalDocuments / limit),
        });
      } catch (error) {
        console.error('Error fetching optimized data:', error);
        response.status(500).send('Failed to fetch data');
    }
};

const getCollections = async (request, response) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map((collection) => collection.name);
        response.json(collectionNames);
    } catch (error) {
        console.error('Error fetching collections:', error);
        response.status(500).send('Failed to fetch collections');
    }
};

const getCollectionData = async (request, response) => {
    try {
        const { collectionName } = request.params;
        const { search = '' } = request.query;
    
        const searchFilter = search ? { $text: { $search: search }, isDeleted: false } : { isDeleted: false };
        const data = await getModel(collectionName).find(searchFilter);
        response.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).send('Failed to fetch data');
    }
};

const deleteStoreData = async (username) => {
  try {
      await Organization.updateMany(
        { identity: username },
        { $set: { isDeleted: true } }
      );
      await Repo.updateMany(
        { identity: username },
        { $set: { isDeleted: true } }
      );
      await Commit.updateMany(
        { identity: username },
        { $set: { isDeleted: true } }
      );
      await Pull.updateMany(
        { identity: username },
        { $set: { isDeleted: true } }
      );
      await Issue.updateMany(
        { identity: username },
        { $set: { isDeleted: true } }
      );
      console.log('Data removal completed successfully.');
    } catch (error) {
      console.error('Error removing data:', error);
    }
};

const getCollectionColumns = async (request, response) => {
  const { collection } = request.body;

  try {
    const columns = generateColumnDefinitions(getModel(collection).schema);
    return response.status(200).json({
      success: true,
      columns,
    });
  } catch (err) {
    return response.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
    fetchIntegrations,
    deleteIntegration,
    fetchOrganizations,
    fetchRepos,
    fetchCommits,
    fetchPulls,
    fetchIssues,
    fetchAndStoreData,
    getData,
    getCollections,
    getCollectionData,
    getCollectionColumns
}

