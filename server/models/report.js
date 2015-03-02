'use strict';

var mongoose = require('mongoose');

var reportSchema = new mongoose.Schema({
  username: String,
  key: String,
  minutes: Number,
  Artist: [],
  Song: [],
  total: Number
});

module.exports = mongoose.model('Report', reportSchema);
