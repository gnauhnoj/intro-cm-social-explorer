'use strict';

var path = require('path');
var lfm = require('./lfm.js');
var Report = require('../models/report.js');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');

var serveIndexHTML = function(req, res) {
  var localpath = path.resolve();
  res.sendFile(localpath + '/client/public/client/templates/index.html');
};

var authLFM = function(req, res) {
  var token = req.query.token;
  // get username, key - resets report for user
  lfm.authenticate(token, function (err, session) {
    if (err) {
      console.log(err);
    } else {
      // alternatively just use req.query
      req.session.username = session.username;
      req.session.key = session.key;
      Report.remove({username : { $exists: false }}, function(err) {
        console.log('Empty Report removed');
      });
      Song.remove({username : { $exists: false }}, function(err) {
        console.log('Empty Song removed');
      });
      Artist.remove({username : { $exists: false }}, function(err) {
        console.log('Empty Artist removed');
      });
      // delete prexisting Report
      Song.remove({username : session.username}, function(err) {
        console.log('Song collection removed');
      });
      Artist.remove({username : session.username}, function(err) {
        console.log('Artist collection removed');
      });
      Report.remove({username : session.username}, function(err) {
        console.log('Report collection removed');
      });

      res.redirect('/getstats');
    }
  });
};

module.exports = exports = {
  serveIndexHTML : serveIndexHTML,
  authLFM : authLFM,
};
