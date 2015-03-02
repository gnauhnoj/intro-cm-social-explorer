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
});

var model = module.exports = mongoose.model('Song', songSchema);

