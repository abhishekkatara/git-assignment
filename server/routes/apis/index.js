'use strict';

const v1ApiController = require('./v1');
let router = require('express').Router();

router.use('/v1', v1ApiController);

module.exports = router;