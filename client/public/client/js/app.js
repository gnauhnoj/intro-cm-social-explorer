'use strict';

var app = angular.module('last-gram-dash', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl : '/public/client/templates/home.html',
      controller : 'loginArea'
    })

    .when('/buildGraph', {
      templateUrl: '/public/client/templates/dash.html',
      controller: 'dashArea'
    })

    .when('/getstats', {
      templateUrl: '/public/client/templates/dash.html',
      controller: 'getStats'
    })

    .when('/report', {
      templateUrl: '/public/client/templates/dash.html',
      controller: 'report'
    });
});

app.controller('loginArea', function($scope, $http) {
});

app.controller('dashArea', function($scope, $http) {
});

app.controller('getStats', function($scope, $http) {
});

app.controller('report', function($scope, $http) {
  $http.get('/buildGraph')
    .success(function(data,status,headers,config) {
      // data.sort
      $scope.Math = window.Math;
      $scope.Artist = data.Artist;
      $scope.Song = data.Song;
      $scope.minutes = Math.round(data.minutes);
      $scope.username = data.username;
      $scope.total = data.total;
      var topArtist = data.Artist[0] || {};
      var topSong = data.Song[0] || {};
      $scope.MaxArtist = topArtist.MaxArtist;
      $scope.MaxArtistArt = topArtist.MaxArtistArt;
      $scope.MaxArtistPlays = topArtist.MaxArtistPlays || 0;
      $scope.MaxSong = topSong.MaxSong;
      $scope.MaxSongArtist = topSong.MaxSongArtist;
      $scope.MaxSongPlays = topSong.MaxSongPlays || 0;
      $scope.MaxSongArt = topSong.MaxSongArt;
      $scope.Ranks = [];

      for (var i = 0; i < $scope.Artist.length; i++) {
        var art = $scope.Artist[i];
        art.inter = Math.round((art.igramComments + art.igramLikes) / art.igramPosts) || 0;
        $scope.Ranks.push(art.inter);
      }

      $scope.Ranks.sort(function(a, b) {
        return b-a;
      });
    }).error(function(data) {
      console.log('errors', data);
    });
});
