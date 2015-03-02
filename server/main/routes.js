'use strict';

var lfm = require('./lfm.js');
var Report = require('../models/report.js');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');
var path = require('path');
var OAuth = require('oauth').OAuth;
var helpers = require('./route-helpers.js');
var fetch = require('./routes-fetchData.js').fetchLFM;
var igram = require('./igram.js');

var username;
var key;

module.exports = exports = function (router) {
  router.route('/')
    .get(helpers.serveIndexHTML);

  router.route('/instagram/:username')
    .get(igram.igramGetID);

  router.route('/auth')
    .get(helpers.authLFM);

  router.route('/getstats')
    .get(fetch);

  router.route('/buildGraph')
    .get(helpers.buildReport);
};
