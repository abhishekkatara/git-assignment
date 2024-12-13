'use strict';
const axios = require('axios');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require('../config');
const { getModel } = require('../models/index.schema');
const githubService = require('../services/github');
function oauthGithub(request, response) {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${ GITHUB_CLIENT_ID}`;
    response.redirect(redirectUri);
}

async function oauthGithubCb(request, response) {
    const { code } = request.query;
    if (!code) {
        return res.status(400).send('Code not provided');
    }
  
    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );
        
        const { access_token } = tokenResponse.data;

        if (!access_token) {
            return response.status(400).send('Failed to fetch access token');
        }
        
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const { login, avatar_url } = userResponse.data;

        const existingUser = await getModel('githubintegrations').findOne({ username: login });

        if (existingUser) {
            existingUser.isDeleted = false;
            existingUser.isSyncing = true;
            existingUser.connectedAt = new Date();
            await existingUser.save();
        } else {
            await getModel('githubintegrations').create({ username: login, avatar_url, connectedAt: new Date() });
        }

        githubService.fetchAndStoreData(login);

        response.redirect(`http://localhost:4200/dashboard?access_token=${access_token}`);
    } catch (error) {
        console.error(error);
        response.status(500).send('An error occurred during GitHub authentication');
    }
}

module.exports = {
    oauthGithub: oauthGithub,
    oauthGithubCb: oauthGithubCb
}