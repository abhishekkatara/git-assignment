'use strict';

const app = require('./app')();
const config = require('./config');

app.create(config);
app.start();