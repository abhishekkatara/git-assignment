const mongoose = require('mongoose');
const { flattenObject } = require('../helpers/custom-functions');
const { setModel } = require('./index.schema');
const IssueSchema = new mongoose.Schema({ 
    identity: { type: String }, 
    repo: { type: String }, 
    organization: { type: String }, 
    url: { type: String },
  repository_url: { type: String },
  labels_url: { type: String },
  comments_url: { type: String },
  events_url: { type: String },
  html_url: { type: String },
  id: { type: Number, required: true, unique: true },
  node_id: { type: String },
  number: { type: Number },
  title: { type: String },
  user: {
    login: { type: String },
    id: { type: Number },
    node_id: { type: String },
    avatar_url: { type: String },
    gravatar_id: { type: String },
    url: { type: String },
    html_url: { type: String },
    followers_url: { type: String },
    following_url: { type: String },
    gists_url: { type: String },
    starred_url: { type: String },
    subscriptions_url: { type: String },
    organizations_url: { type: String },
    repos_url: { type: String },
    events_url: { type: String },
    received_events_url: { type: String },
    type: { type: String },
    user_view_type: { type: String },
    site_admin: { type: Boolean },
  },
  labels: { type: Array, default: [] },
  state: { type: String },
  locked: { type: Boolean },
  assignee: { type: mongoose.Schema.Types.Mixed, default: null },
  assignees: { type: Array, default: [] },
  milestone: { type: mongoose.Schema.Types.Mixed, default: null },
  comments: { type: Number },
  created_at: { type: Date },
  updated_at: { type: Date },
  closed_at: { type: Date },
  author_association: { type: String },
  active_lock_reason: { type: String, default: null },
  body: { type: String },
  closed_by: {
    login: { type: String },
    id: { type: Number },
    node_id: { type: String },
    avatar_url: { type: String },
    gravatar_id: { type: String },
    url: { type: String },
    html_url: { type: String },
    followers_url: { type: String },
    following_url: { type: String },
    gists_url: { type: String },
    starred_url: { type: String },
    subscriptions_url: { type: String },
    organizations_url: { type: String },
    repos_url: { type: String },
    events_url: { type: String },
    received_events_url: { type: String },
    type: { type: String },
    user_view_type: { type: String },
    site_admin: { type: Boolean },
  },
  reactions: {
    url: { type: String },
    total_count: { type: Number },
    "+1": { type: Number },
    "-1": { type: Number },
    laugh: { type: Number },
    hooray: { type: Number },
    confused: { type: Number },
    heart: { type: Number },
    rocket: { type: Number },
    eyes: { type: Number },
  },
  timeline_url: { type: String },
  performed_via_github_app: { type: mongoose.Schema.Types.Mixed, default: null },
  state_reason: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
});
IssueSchema.index({ id: 1 }, { unique: true });
IssueSchema.index({ number: 1 });
IssueSchema.index({ state: 1 });
IssueSchema.index({ 'user.login': 1 });
IssueSchema.index({ 'labels.name': 1 });
IssueSchema.index({ created_at: -1 });
IssueSchema.index({ updated_at: -1 });
IssueSchema.index({ closed_at: -1 });
IssueSchema.index({ body: 'text' });
IssueSchema.post("find", function (docs, next) {
  docs.forEach((doc, index) => {
    docs[index] = flattenObject(doc.toObject());
  });
  next();
});

const Issue = mongoose.model('Issue', IssueSchema);
setModel(Issue.collection.name, Issue);
module.exports = Issue;