'use strict';

var Report = require('../models/report.js');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');

var buildReport = function(req, res){
  var report = {
    username: req.session.username,
    key: req.session.key
  };

  Song.find({username: req.session.username}).sort('-count').exec(function(err, sortedSongs) {
    // get references to more than one song
    // build array of 10
    var report = {};
    report.username = req.session.username;
    report.Song = [];
    report.Artist = [];
    report.minutes = 0;
    report.total = 0;

    for (var count = 0; count < sortedSongs.length; count++) {
      if (sortedSongs[count].minutes) {
        report.minutes += (sortedSongs[count].minutes * sortedSongs[count].count);
      }
      report.total += sortedSongs[count].count;

      if (count < 10) {
        var topSong = {};
        topSong.MaxSong = sortedSongs[count].title;
        topSong.MaxSongPlays = sortedSongs[count].count;
        topSong.MaxSongArtist = sortedSongs[count].artist;

        if (sortedSongs[count].art) {
          topSong.MaxSongArt = sortedSongs[count].art;
        }
        report.Song.push(topSong);
      }
    }

    Artist.find({username: req.session.username}).sort('-count').exec(function(err, sortedArtists) {
      for (var i = 0; i < 10; i++) {
        var topArtist = {};
        topArtist.MaxArtistPlays = sortedArtists[i].count;
        topArtist.MaxArtist = sortedArtists[i].artist;

        if (sortedArtists[i].art) {
          topArtist.MaxArtistArt = sortedArtists[i].art;
        }
        report.Artist.push(topArtist);
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
  buildReport : buildReport
};
