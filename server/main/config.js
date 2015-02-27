'use strict';

var morgan = require('morgan');
var middle = require('./middleware');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var mongo_url = 'MONGOLAB_URI';

mongoose.connect(process.env[mongo_url] || 'mongodb://localhost/lastspotdash');

/*
 * Include all your global env variables here.
*/

global.maxSize = 20;

module.exports = exports = function (app, express, routers) {
  app.set('port', process.env.PORT || 9000);
  app.set('base url', process.env.PORT || 'http://localhost');
  app.use(morgan('dev'));
  app.use(bodyParser.json({limit: global.maxSize + 'mb'}));
  app.use(bodyParser.urlencoded({extended: true}));
  // Middleware
  app.use(middle.cors);
  app.use(express.static(__dirname + '/../../client/public'));
  app.use(express.static(__dirname + '/../../client'));
  app.use('/', routers.lfmRoutes);
  // Error handling
  app.use(middle.logError);
  app.use(middle.handleError);
};


