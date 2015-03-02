'use strict';

var LastfmAPI = require('lastfmapi');
var lfmSecret = require('./secret.js');

module.exports = exports = new LastfmAPI({
  'api_key' : process.env.LASTFM_API_KEY || lfmSecret.LASTFM_API_KEY,
  'secret' : process.env.LASTFM_API_SECRET || lfmSecret.LASTFM_API_SECRET
});
