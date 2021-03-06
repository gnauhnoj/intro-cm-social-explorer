'use strict';

var moment = require('moment');
var Artist = require('../models/artist.js');
var async = require('async');
var https = require('https');
var path = require('path');

var igramGetAll = function (req, res) {
  var lfmUser = req.session.username;
  Artist.find({username: lfmUser}).sort('-count').limit(10).exec(function(err, topTen) {
      console.log(topTen);
      var allArtists = [];
      if (topTen.length > 0) {
        getID(allArtists, topTen, res, lfmUser);
      } else {
        console.log('redirect');
        res.redirect('/report');
      }
    });
};

function getID(allArtists, artists, res, lfmUser) {
  var currentArtist = artists.pop();
  var name = currentArtist.artist;
  console.log(name);
  var username = encodeURIComponent(name.replace(/\s/g, ''));
  var url = 'https://api.instagram.com/v1/users/search?access_token=1663458943.d8bde85.09b90e0507f044fb9c6091fb6d874c1c&q=' + username + '&count=1';

  console.log(name);
  console.log(url);
  var request = https.get(url, function (response) {

      var buffer = '',
          data,
          posts;

      response.on('data', function (chunk) {
          buffer += chunk;
      });

      response.on('end', function (err) {
          var tempName;
          data = JSON.parse(buffer);

          if (data.data[0]) {
            var thisArtist = {};
            thisArtist.name = name;
            thisArtist.username = username;
            thisArtist.totalComments = 0;
            thisArtist.totalPosts = 0;
            thisArtist.totalLikes = 0;
            allArtists.push(thisArtist);

            tempName = data.data[0];
          } else {
            tempName = {id: 0};
          }
          console.log(tempName.id);
          var postsUrl = 'https://api.instagram.com/v1/users/' + tempName.id + '/media/recent?access_token=1663458943.d8bde85.09b90e0507f044fb9c6091fb6d874c1c';
          getPosts(allArtists, artists, postsUrl, res, lfmUser);
          // res.status(200).send(data.data[0].username + '</br>' + data.data[0].id + '</br>' + '</br>' + posts);
      });
  });
}

function getPosts(allArtists, artists, url, res, lfmUser) {

  var request = https.get(url, function (response) {

      var buffer = '',
          data,
          nextUrl = '';

      response.on('data', function (chunk) {
          buffer += chunk;
      });

      response.on('end', function (err) {

          data = JSON.parse(buffer);
          var allPost = '', eachPost;
          var dateLimit = moment().subtract(3, 'months');

          if (!data.data) {
            if (artists.length === 0) {
              console.log(allArtists);
              updateDatabase(allArtists, res, lfmUser);
            } else {
              getID(allArtists, artists, res, lfmUser);
            }
          }
          else {
            for (var i = 0; i < data.data.length; i++) {
              var date = moment.unix(parseInt(data.data[i].created_time));
              var caption = '';

              if (date < dateLimit) {
                break;
              }

              allArtists[allArtists.length-1].totalComments += parseInt(data.data[i].comments.count);
              allArtists[allArtists.length-1].totalPosts += 1;
              allArtists[allArtists.length-1].totalLikes += parseInt(data.data[i].likes.count);
            }

            nextUrl = data.pagination.next_url;

            if (date < dateLimit) {
                nextUrl = '';
            }

            if (!nextUrl) {
              if (artists.length === 0) {
                console.log(allArtists);
                updateDatabase(allArtists, res, lfmUser);
              } else {
                getID(allArtists, artists, res, lfmUser);
              }
            } else {
              getPosts(allArtists, artists, nextUrl, res, lfmUser);
            }
          }
      });
  });

}

function updateDatabase(allArtists, res, lfmUser) {
  async.each(allArtists, function(eachArtist, callback) {
    console.log(lfmUser);
    var search = {artist: eachArtist.name, username: lfmUser};
    var update = {igramPosts: eachArtist.totalPosts, igramComments: eachArtist.totalComments, igramLikes: eachArtist.totalLikes};
    Artist.update(search, {$set: update}, function(err, updated) {
      if( err ) {
        console.log('Artist not updated');
      } else {
        console.log('Artist updated');
        console.log(search, update);
        callback();
      }
    });
  }, function(err) {
    if (err) {
      throw(err);
    } else {
      console.log('finish updating database');
      res.redirect('/report');
    }
  });
}


module.exports = exports = {
  igramGetAll : igramGetAll
};
