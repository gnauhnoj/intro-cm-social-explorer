'use strict';

var LastfmAPI = require('lastfmapi');
var lfmSecret = require('./secret.js');

module.exports = exports = new LastfmAPI({
  'api_key' : lfmSecret.LASTFM_API_KEY,
  'secret' : lfmSecret.LASTFM_API_SECRET
});
