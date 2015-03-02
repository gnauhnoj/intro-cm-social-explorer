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
  var report = {
    username: req.session.username,
    key: req.session.key
  };

  // TODO: Promisify this for Dafi probably
  Song.find({username: req.session.username}).sort('-count').exec(function(err, sortedSongs) {
    // get references to more than one song
    var topSong = sortedSongs[0];
    report.MaxSong = topSong.title;
    report.MaxSongPlays = topSong.count;
    report.MaxSongArtist = topSong.artist;
    report.minutes = 0;
    report.total = 0;
    if (topSong.art) {
      report.MaxSongArt = topSong.art;
    }

    for (var count=0; count < sortedSongs.length; count++) {
      if (sortedSongs[count].minutes) {
        report.minutes += (sortedSongs[count].minutes * sortedSongs[count].count);
      }
      report.total += sortedSongs[count].count;
    }

    Artist.find({username: req.session.username}).sort('-count').exec(function(err, sortedArtists) {
      var topArtist = sortedArtists[0];
      report.MaxArtist = topArtist.artist;
      report.MaxArtistPlays = topArtist.count;
      if (topArtist.art) {
        report.MaxArtistArt = topArtist.art;
      }

      var newReport = new Report(report);
      newReport.save(function(err, stuff){
        if (err) {throw (err);}
        res.status(200).send(stuff);
      });
    });
  });
};

module.exports = exports = {
  serveIndexHTML : serveIndexHTML,
  authLFM : authLFM,
  buildReport : buildReport
};
