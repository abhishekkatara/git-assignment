'use strict';

const { authController, dashboardController, githubController } = require('../../controllers/index');
const router = require('express').Router();

router.use('/auth', authController);
router.use('/github', githubController);
router.use('/dashboard', dashboardController);

module.exports = router;