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

var buildReport = function(req, res){
  var replace = {};

  // TODO: Promisify this for Dafi probably
  Song.find({username: req.session.username}).sort('-count').exec(function(err, sortedSongs) {
    // get references to more than one song
    var topSong = sortedSongs[0];
    replace.MaxSong = topSong.title;
    replace.MaxSongPlays = topSong.count;
    replace.MaxSongArtist = topSong.artist;
    replace.minutes = 0;
    replace.total = 0;
    if (topSong.art) {
      replace.MaxSongArt = topSong.art;
    }

    for (var count=0; count < sortedSongs.length; count++) {
      replace.minutes += (sortedSongs[count].minutes * sortedSongs[count].count);
      replace.total += sortedSongs[count].count;
    }

    Artist.find({username: req.session.username}).sort('-count').exec(function(err, sortedArtists) {
      var topArtist = sortedArtists[0];
      replace.MaxArtist = topArtist.artist;
      replace.MaxArtistPlays = topArtist.count;
      if (topArtist.art) {
        replace.MaxArtistArt = topArtist.art;
      }

      Report.find({username: req.session.username}, function(err, report) {
        Report.update({username: report[0].username}, replace, function (err, result){
          Report.find({username: report[0].username}, function(err, result){
            res.status(200).send(result[0]);
          });
        });
      });
    });
  });
};

module.exports = exports = {
  serveIndexHTML : serveIndexHTML,
  authLFM : authLFM,
  buildReport : buildReport
};
