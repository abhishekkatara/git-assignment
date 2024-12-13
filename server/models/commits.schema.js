const mongoose = require('mongoose');
const { flattenObject } = require('../helpers/custom-functions');
const { setModel } = require('./index.schema');
const CommitSchema = new mongoose.Schema({ 
    identity: { type: String }, 
    repo: { type: String }, 
    organization: { type: String }, 
    sha: { type: String },
    node_id: { type: String },
    commit: {
      author: {
        name: { type: String },
        email: { type: String },
        date: { type: Date },
      },
      committer: {
        name: { type: String },
        email: { type: String },
        date: { type: Date },
      },
      message: { type: String },
      tree: {
        sha: { type: String },
        url: { type: String },
      },
      url: { type: String },
      comment_count: { type: Number, default: 0 },
      verification: {
        verified: { type: Boolean, default: false },
        reason: { type: String },
        signature: { type: String, default: null },
        payload: { type: String, default: null },
        verified_at: { type: Date, default: null },
      },
    },
    url: { type: String },
    html_url: { type: String },
    comments_url: { type: String },
    author: {
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
    committer: {
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
    parents: [
      {
        sha: { type: String },
        url: { type: String },
        html_url: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false },
});
CommitSchema.index({ sha: 1 }, { unique: true });
CommitSchema.index({ 'commit.author.name': 1 });
CommitSchema.index({ 'commit.author.email': 1 });
CommitSchema.index({ 'commit.committer.name': 1 });
CommitSchema.index({ 'commit.committer.email': 1 });
CommitSchema.index({ 'commit.message': 'text' });
CommitSchema.post("find", function (docs, next) {
  docs.forEach((doc, index) => {
    docs[index] = flattenObject(doc.toObject());
  });
  next();
});
const Commit = mongoose.model('Commit', CommitSchema);
setModel(Commit.collection.name, Commit);

module.exports = Commit;