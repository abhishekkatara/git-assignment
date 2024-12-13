'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');

module.exports = function() {
  let app = express();

  let create = (config) => {
      let routes = require('./routes/index.route');

      // app.set('env', config.env);
      app.set('port', config.PORT);
      app.set('hostname', config.HOSTNAME);

      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(cookieParser());
      app.use(logger('dev'));
      mongoose.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
      db.once('open', () => console.log('Connected to MongoDB'));;
      routes.init(app);
  };

  let start = function() {
    let hostname = app.get('hostname'),
      port = app.get('port');

    app.listen(port, function () {
      console.log(`Server is running on http://${hostname}:${port}`);
    });
  };

  return {
    create: create,
    start: start
  };
};