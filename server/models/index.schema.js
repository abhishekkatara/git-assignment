const modelCache = {};
const setModel = (_collectionName, _model) => {
    modelCache[_collectionName] = _model;
};
const getModel = (_collectionName) => {
    return modelCache[_collectionName];
};
module.exports = {
    setModel,
    getModel,
}
const Commit = require("./commits.schema");
const GitHubIntegration = require("./github-integration.schema");
const Issue = require("./issues.schema");
const Organization = require("./organizations.schema");
const Pull = require("./pulls.schema");
const Repo = require("./repos.schema");