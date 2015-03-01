'use strict';

var helpers = require('./route-helpers.js');
var fetch = require('./routes-fetchData.js').fetchLFM;

var username;
var key;

module.exports = exports = function (router) {
  router.route('/')
    .get(helpers.serveIndexHTML);

  router.route('/auth')
    .get(helpers.authLFM);

  router.route('/getstats')
    .get(fetch);

  router.route('/buildGraph')
    .get(helpers.buildReport);
};
