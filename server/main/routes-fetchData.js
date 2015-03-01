'use strict';

var path = require('path');
var lfm = require('./lfm.js');
var Report = require('../models/report.js');
var Song = require('../models/song.js');
var Artist = require('../models/artist.js');

var fetchLFM = function(req, res) {
  // hard coded date - TODO: Add functionality to specify length
  var dateTime = (new Date().getTime()/ 1000) - (86400*30); // 1 month
  // var dateTime = (new Date().getTime()/ 1000) - (86400*7); // 1 day
  // var dateTime = (new Date().getTime()/ 1000) - (86400); // 1 day
  // var dateTime = (new Date().getTime()/ 1000) - (86400/24); // 1 hour

  var username = req.session.username;
  lfm.setSessionCredentials(username, req.session.key);

  lfm.user.getRecentTracks({
    user: username,
    from: dateTime,
    limit: 200,
    api_key: lfm.api_key
  }, function (err, recentTracks) {
    if (err) {
      console.log(err);
    } else {

      var report = new Report({
        username: username,
        key: req.session.key,
        total: recentTracks['@attr'].total
      });

      report.save(function(err, report) {
        var trackArr = recentTracks.track;

        (function(){
          var i = 0;
          function forloop(){
            if(i<trackArr.length){
              var artistName = trackArr[i].artist['#text'];
              var songName = trackArr[i].name;

              // look for existing artists
              Artist.findOne({artist: artistName, username: username}, function(err, artist) {
                if (artist) {
                  Artist.update({artist: artistName, username: username}, {count: artist.count+1}, function(err,stuff) {

                    // look for existing songs
                    Song.findOne({artist: artistName, title: songName, username: username}, function(err, song) {
                      if (song) {
                        Song.update({artist: artistName, title: songName, username: username}, {count: song.count+1}, function(err,stuff) {
                          i++;
                          forloop();
                        });
                      } else {
                        var song = new Song({
                          artist: artistName,
                          title: songName,
                          count: 1,
                          username: username
                        });
                        song.save(function(err, stuff){
                          i++;
                          forloop();
                        });
                      }
                    });
                  });
                } else {
                  var artist = new Artist({
                    artist: artistName,
                    count: 1,
                    username: username
                  });
                  artist.save(function(err, stuff) {
                    // look for existing songs
                    Song.findOne({artist: artistName, title: songName, username: username}, function(err, song) {
                      if (song) {
                        Song.update({artist: artistName, title: songName, username: username}, {count: song.count+1}, function(err,stuff) {
                          i++;
                          forloop();
                        });
                      } else {
                        var song = new Song({
                          artist: artistName,
                          title: songName,
                          count: 1,
                          username: username
                        });
                        song.save(function(err, stuff){
                          i++;
                          forloop();
                        });
                      }
                    });
                  });
                }
              });
            }else{
              // console.log('done loading db');
              Song.find({username: username}, function(err, result) {
                var cont = true;
                for (var i = 0; i<result.length; i++) {
                  cont = cont && result[i].load;
                }
                // console.log(cont);
                if (!cont) {
                  forloop();
                } else {
                  Artist.find({username: username}, function(err, result2) {
                    var cont2 = true;
                    for(var j = 0; j<result2.length; j++) {
                      cont2 = cont2 && result2[j].load;
                    }
                    if (!cont) {
                      forloop();
                    } else {
                      var localpath = path.resolve();
                      res.sendFile(localpath+'/client/public/client/templates/index.html');
                    }
                  });
                }
              });
            }
          }
          forloop();
        })();
      });
    }
  });

  // lfm.user.getTopTracks({
  //   user: username,
  //   period: '3month',
  //   limit: 200,
  //   api_key: lfm.api_key
  // }, function(err, topTracks) {
  //   if (err) {throw(err);}
  //   res.status(200).send(topTracks);
  // });

  // lfm.user.getTopArtists({
  //   user: username,
  //   period: '3month',
  //   limit: 200,
  //   api_key: lfm.api_key
  // }, function(err, topTracks) {
  //   if (err) {throw(err);}
  //   res.status(200).send(topTracks);
  // });

};

module.exports = exports = {
  fetchLFM : fetchLFM
};
