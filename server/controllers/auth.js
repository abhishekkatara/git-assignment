'use strict';

const loginService = require('../services/auth');
let router = require('express').Router();

router.get('/github', loginService.oauthGithub);
router.get('/github/callback', loginService.oauthGithubCb);

module.exports = router;