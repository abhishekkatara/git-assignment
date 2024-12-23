const mongoose = require('mongoose');
const { flattenObject } = require('../helpers/custom-functions');
const { setModel } = require('./index.schema');
const PullSchema = new mongoose.Schema({ 
    identity: { type: String }, 
    repo: { type: String }, 
    organization: { type: String }, 
    url: { type: String },
    id: { type: Number, unique: true },
    node_id: { type: String },
    html_url: { type: String },
    diff_url: { type: String },
    patch_url: { type: String },
    issue_url: { type: String },
    number: { type: Number },
    state: { type: String },
    locked: { type: Boolean, default: false },
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
    body: { type: String, default: '' },
    created_at: { type: Date },
    updated_at: { type: Date },
    closed_at: { type: Date, default: null },
    merged_at: { type: Date, default: null },
    merge_commit_sha: { type: String, default: null },
    assignee: { type: mongoose.Schema.Types.Mixed, default: null },
    assignees: { type: Array, default: [] },
    requested_reviewers: [
      {
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
    ],
    requested_teams: { type: Array, default: [] },
    labels: { type: Array, default: [] },
    milestone: { type: mongoose.Schema.Types.Mixed, default: null },
    draft: { type: Boolean, default: false },
    commits_url: { type: String },
    review_comments_url: { type: String },
    review_comment_url: { type: String },
    comments_url: { type: String },
    statuses_url: { type: String },
    head: {
      label: { type: String },
      ref: { type: String },
      sha: { type: String },
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
      repo: { type: mongoose.Schema.Types.Mixed },
    },
    base: {
      label: { type: String },
      ref: { type: String },
      sha: { type: String },
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
      repo: { type: mongoose.Schema.Types.Mixed },
    },
    _links: {
      self: { href: { type: String } },
      html: { href: { type: String } },
      issue: { href: { type: String } },
      comments: { href: { type: String } },
      review_comments: { href: { type: String } },
      review_comment: { href: { type: String } },
      commits: { href: { type: String } },
      statuses: { href: { type: String } },
    },
    author_association: { type: String },
    auto_merge: { type: mongoose.Schema.Types.Mixed, default: null },
    active_lock_reason: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
});
PullSchema.index({ id: 1 }, { unique: true });
PullSchema.index({ number: 1 });
PullSchema.index({ state: 1 });
PullSchema.index({ 'user.login': 1 });
PullSchema.index({ created_at: -1 });
PullSchema.index({ updated_at: -1 });
PullSchema.index({ merged_at: -1 });
PullSchema.index({ title: 'text', body: 'text' });
PullSchema.post("find", function (docs, next) {
  docs.forEach((doc, index) => {
    docs[index] = flattenObject(doc.toObject());
  });
  next();
});
const Pull = mongoose.model('Pull', PullSchema);
setModel(Pull.collection.name, Pull);
module.exports = Pull;