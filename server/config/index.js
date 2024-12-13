
// process.env['envconfig'] = require('dotenv').config({ path: `` });
'use strict';

const _ = require('lodash');
const env = `.env.${process.env.NODE_ENV || 'development'}.local`;
const envConfig = require(`${process.cwd()}/config/${env}`);
module.exports = {
    PORT: 3000,
    HOSTNAME: 'localhost',
    DB_URL: 'mongodb://localhost:27017/integrations',
    GITHUB_CLIENT_ID: '',
    GITHUB_CLIENT_SECRET: ''
};