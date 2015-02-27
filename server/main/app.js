'use strict';

var express = require('express');
var app = express();
var routers = {};

var lfmRoutes = express.Router();
routers.lfmRoutes = lfmRoutes;

require('./config.js')(app, express, routers);
require('./routes.js')(lfmRoutes);

module.exports = exports = app;
