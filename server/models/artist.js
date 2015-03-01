'use strict';

var mongoose = require('mongoose');

var lfm = require('../main/lfm.js');

var artistSchema = new mongoose.Schema({
  username: String,
  artist: String,
  count: Number,
  art: String,
  load: Boolean
});

var model = module.exports = mongoose.model('Artist', artistSchema);

artistSchema.post('save',function(next) {
  var username = this.username;
  lfm.artist.getInfo({
    'artist': this.artist,
  }, function(err, artist){
    if (err) { throw(err); }

    var art;
    var replace;
    var search = {artist: artist.name, username: username};

    if (artist.image) {
      art = artist.image[artist.image.length-1]['#text'];
      replace = {art: art, load: true};

      model.update(search, replace, function(err, stuff){
        if (err) { throw(err); }
      });
    }
  });
});

