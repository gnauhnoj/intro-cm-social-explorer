'use strict';

var mongoose = require('mongoose');

var lfm = require('../main/lfm.js');

var artistSchema = new mongoose.Schema({
  username: String,
  artist: String,
  count: Number,
  art: String,
  igramPosts: Number,
  igramComments: Number,
  igramLikes: Number,
});

var model = module.exports = mongoose.model('Artist', artistSchema);

