'use strict';

var mongoose = require('mongoose');
var lfm = require('../main/lfm.js');

var songSchema = new mongoose.Schema({
  username: String,
  artist: String,
  title: String,
  minutes: Number,
  count: Number,
  art: String,
  load: Boolean
});

var model = module.exports = mongoose.model('Song', songSchema);

songSchema.post('save',function(next) {
  var username = this.username;
  lfm.track.getInfo({
    'artist': this.artist,
    'track': this.title
  }, function(err, track){
    if (err) { throw(err); }

    var minutes;
    var art;
    var replace;

    minutes = (parseInt(track.duration)/1000)/60;
    replace = {minutes: minutes, load: true};
    if (track.album && track.album.image) {
      art = track.album.image[track.album.image.length-1]['#text'];
      replace = {minutes: minutes, art: art, load: true};
    }
    var search = {artist: track.artist.name, title: track.name, username: username};

    model.update(search, replace, function(err, stuff){
      if (err) { throw(err); }
    });
  });
});
