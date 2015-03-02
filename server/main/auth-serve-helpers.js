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
      // delete prexisting Report
      Report.remove({username : session.username}, function(err) {
        console.log('Report collection removed');
      });
      // TODO: this is hella dumb. maybe create references from report to Song/Artists
      Song.remove({username : session.username}, function(err) {
        console.log('Song collection removed');
      });
      Artist.remove({username : session.username}, function(err) {
        console.log('Artist collection removed');
      });
      res.redirect('/getstats');
    }
  });
};

module.exports = exports = {
  serveIndexHTML : serveIndexHTML,
  authLFM : authLFM,
};
