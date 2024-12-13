const mongoose = require('mongoose');
const { setModel } = require('./index.schema');
const OrganizationSchema = new mongoose.Schema({ 
    identity: { type: String }, 
    name: { type: String }, 
    login: { type: String },
    id: { type: String },
    node_id: { type: String },
    url: { type: String },
    repos_url: { type: String },
    events_url: { type: String },
    hooks_url: { type: String },
    issues_url: { type: String },
    members_url: { type: String },
    public_members_url: { type: String },
    avatar_url: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
});
OrganizationSchema.index({ id: 1 }, { unique: true });
OrganizationSchema.index({ login: 1 });
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ description: 'text' });
const Organization = mongoose.model('Organization', OrganizationSchema);
setModel(Organization.collection.name, Organization);
module.exports = Organization;