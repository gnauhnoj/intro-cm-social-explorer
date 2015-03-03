'use strict';

var path = require('path');
var lfm = require('./lfm.js');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');
var async = require('async');

var timePer = '3month';

var artistQuery = function(username, res, page, totalPages) {
  page = page || 1;
  totalPages = totalPages || 1;
  if (page > totalPages) {
    // TODO: refactor
    var localpath = path.resolve();
    res.redirect('/instagram');
    // res.sendFile(localpath+'/client/public/client/templates/index.html');
    return;
  }
  lfm.user.getTopArtists({
    user: username,
    period: timePer,
    limit: 200,
    api_key: lfm.api_key,
    page: page
  }, function(err, topArtists) {
    if (err) {console.log(err); throw(err);}
    var artists = topArtists.artist;
    var stats = topArtists['@attr'];
    var total = stats.total;
    console.log('Total Artists: ', total);
    var pages = Math.ceil(total / 200);

    async.each(artists, function(art, callback) {
      var newArtist = {
        artist: art.name,
        count: art.playcount,
        username: username
      };
      if (art.image) {
        newArtist.art = art.image[art.image.length-1]['#text'];
      }
      var artist = new Artist(newArtist);
      artist.save(function(err, stuff){
        if (err) {throw (err);}
        callback();
      });
    }, function(err) {
      if( err ) { throw(err); }
      artistQuery(username, res, page+1, pages);
    });
  });
};

var trackQuery = function(username, res, page, totalPages) {
  page = page || 1;
  totalPages = totalPages || 1;
  if (page > totalPages) {
    // TODO: refactor
    artistQuery(username, res);
    return;
  }
  lfm.user.getTopTracks({
    user: username,
    period: timePer,
    limit: 200,
    api_key: lfm.api_key,
    page: page
  }, function(err, topTracks) {
    if (err) {console.log(err); throw(err);}
    var tracks = topTracks.track;
    var stats = topTracks['@attr'];
    var total = stats.total;
    console.log('Total Songs: ', total);
    var pages = Math.ceil(total / 200);

    async.each(tracks, function(track, callback) {
      var newSong = {
        artist: track.artist.name,
        title: track.name,
        count: track.playcount,
        username: username
      };
      if (track.duration.length) {
        newSong.minutes = parseInt(track.duration)/60;
      }
      if (track.image) {
        newSong.art = track.image[track.image.length-1]['#text'];
      }
      var song = new Song(newSong);
      song.save(function(err, stuff){
        if (err) {throw (err);}
        callback();
      });
    }, function(err) {
      if( err ) { throw(err); }
      trackQuery(username, res, page+1, pages);
    });
  });
};

var fetchLFM = function(req, res) {
  var username = req.session.username;
  lfm.setSessionCredentials(username, req.session.key);
  // ugly way to force sequential
  // TODO: refactor
  trackQuery(username, res);
};

module.exports = exports = {
  fetchLFM : fetchLFM
};
