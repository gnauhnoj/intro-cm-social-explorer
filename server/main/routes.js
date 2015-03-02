'use strict';

var lfm = require('./lfm.js');
var Report = require('../models/report.js');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');
var path = require('path');
var authServe = require('./auth-serve-helpers.js');
var build = require('./report-helpers.js');
var fetch = require('./routes-fetchData.js').fetchLFM;
var igram = require('./igram.js');

var username;
var key;

module.exports = exports = function (router) {
  router.route('/')
    .get(authServe.serveIndexHTML);

  router.route('/instagram/:username')
    .get(igram.igramGetID);

  router.route('/auth')
    .get(authServe.authLFM);

  router.route('/getstats')
    .get(fetch);

  router.route('/buildGraph')
    .get(build.buildReport);
};
