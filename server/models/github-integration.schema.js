const mongoose = require('mongoose');
const { setModel } = require('./index.schema');
const GitHubIntegrationSchema = new mongoose.Schema({
    username: { type: String },
    avatar_url: { type: String },
    connectedAt: { type: Date },
    lastSynced: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isSyncing: { type: Boolean, default: true }
});
GitHubIntegrationSchema.index({ username: 1 }, { unique: true });
GitHubIntegrationSchema.index({ connectedAt: -1 });
GitHubIntegrationSchema.index({ lastSynced: -1 });
GitHubIntegrationSchema.index({ isDeleted: 1 });
const GitHubIntegration = mongoose.model('GitHubIntegration', GitHubIntegrationSchema);
setModel(GitHubIntegration.collection.name, GitHubIntegration);
module.exports = GitHubIntegration;