'use strict';

var moment = require('moment');

var igramGetID = function(req, res) {
  var https = require("https");
  var username = req.params.username;
  var url = "https://api.instagram.com/v1/users/search?access_token=1663458943.d8bde85.09b90e0507f044fb9c6091fb6d874c1c&q=" + username + "&count=1";

  // req.params.username
  var request = https.get(url, function (response) {

      var buffer = "",
          data,
          posts;

      response.on("data", function (chunk) {
          buffer += chunk;
      });

      response.on("end", function (err) {

          data = JSON.parse(buffer);

          // userid = data.data[0].id;
          posts = getUserPosts(data.data[0].id, data.data[0].username, res);
          // res.status(200).send(data.data[0].username + "</br>" + data.data[0].id + "</br>" + "</br>" + posts);
      });
  });
}

function getUserPosts(userid, username, res) {
  // console.log(userid + " blaaa");
  var https = require("https");
  var url = "https://api.instagram.com/v1/users/" + userid + "/media/recent?access_token=1663458943.d8bde85.09b90e0507f044fb9c6091fb6d874c1c";
  console.log(url);

  // req.params.username
  var request = https.get(url, function (response) {

      var buffer = "",
          data,
          nextUrl,
          firstPost;

      var countPost = 0,
          countLikes = 0,
          countComments = 0;


      response.on("data", function (chunk) {
          buffer += chunk;
      });

      response.on("end", function (err) {

          data = JSON.parse(buffer);
          var allPost = "", eachPost;
          var dateLimit = moment().subtract(3, 'months');

          for (var i = 0; i < data.data.length; i++) {
            var date = moment.unix(parseInt(data.data[i].created_time));
            var formatted = date.format("MM-DD-YYYY hh:MM:ss");
            var caption = "";

            if (date < dateLimit) {
              break;
            }

            if (!data.data[i].caption) {caption = "untitled";}
            else {caption = data.data[i].caption.text}
            eachPost = caption + "</br>" + data.data[i].images.standard_resolution.url + "</br>" + "likes: " + data.data[i].likes.count + "</br>" + "comments: " + data.data[i].comments.count + "</br>" + "time: " + formatted;
            allPost += (eachPost + "</br>" + "</br>");

            countPost += 1;
            countComments += parseInt(data.data[i].comments.count);
            countLikes += parseInt(data.data[i].likes.count)
          }

          nextUrl = data.pagination.next_url;

          if (date < dateLimit) {
              nextUrl = "";
            }

          if (!nextUrl) {
            res.status(200).send(username + "</br>" + userid + "</br>" + "Total comments: " + countComments + "</br>" + "Total likes: " + countLikes + "</br>" + "Total posts: " + countPost + "</br>" + nextUrl + "</br>" + "</br>" + allPost);
          } else {
            getMorePosts(username, userid, allPost, nextUrl, countPost, countComments, countLikes, res)
          }
      });
  });

}

function getMorePosts(username, userid, prevText, nextUrl, countPost, countComments, countLikes, res) {

  var https = require("https");
  var url = nextUrl;
  console.log(url);

  // req.params.username
  var request = https.get(url, function (response) {

      var buffer = "",
          data,
          nextUrl,
          firstPost;

      response.on("data", function (chunk) {
          buffer += chunk;
      });

      response.on("end", function (err) {

          data = JSON.parse(buffer);
          var allPost = "", eachPost;
          var dateLimit = moment().subtract(3, 'months');

          for (var i = 0; i < data.data.length; i++) {
            var date = moment.unix(parseInt(data.data[i].created_time));
            var formatted = date.format("MM-DD-YYYY hh:MM:ss");
            var caption = "";

            if (date < dateLimit) {
              break;
            }

            if (!data.data[i].caption) {caption = "untitled";}
            else {caption = data.data[i].caption.text}
            eachPost = caption + "</br>" + data.data[i].images.standard_resolution.url + "</br>" + "likes: " + data.data[i].likes.count + "</br>" + "comments: " + data.data[i].comments.count + "</br>" + "time: " + formatted;
            allPost += (eachPost + "</br>" + "</br>");

            countPost += 1;
            countComments += parseInt(data.data[i].comments.count);
            countLikes += parseInt(data.data[i].likes.count)
          }

          nextUrl = data.pagination.next_url;
          allPost = prevText + allPost;

          if (date < dateLimit) {
              nextUrl = "";
            }

          if (!nextUrl) {
            res.status(200).send(username + "</br>" + userid + "</br>" + "Total comments: " + countComments + "</br>" + "Total likes: " + countLikes + "</br>" + "Total posts: " + countPost + "</br>" + nextUrl + "</br>" + "</br>" + allPost);
          } else {
            getMorePosts(username, userid, allPost, nextUrl, countPost, countComments, countLikes, res);
          }
      });
  });
}


module.exports = exports = {
  igramGetID : igramGetID
};
