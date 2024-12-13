'use strict';
let router = require('express').Router();

const loginService = require('../services/dashboard');

router.post('/', loginService.getDashboard);

module.exports = router;