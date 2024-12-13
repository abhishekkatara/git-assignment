'use strict';

const githubService = require('../services/github');

let router = require('express').Router();

router.get('/integration/github', githubService.fetchIntegrations);
router.get('/get-data', githubService.getData);
router.get('/collections', githubService.getCollections);
router.get('/data/:collectionName', githubService.getCollectionData);
router.post('/columns/:collectionName', githubService.getCollectionColumns);
router.delete('/integration/github/:username', githubService.deleteIntegration);

module.exports = router;