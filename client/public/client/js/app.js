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
      templateUrl: '/public//client/templates/dash.html',
      controller: 'dashArea'
    })

    .when('/getstats', {
      templateUrl: '/public/client/templates/dash.html',
      controller: 'getStats'
    });
});

app.controller('loginArea', function($scope, $http) {
});

app.controller('getStats', function($scope, $http) {
  console.log('get request sent');
  $http.get('/buildGraph')
    .success(function(data,status,headers,config) {
      console.log('DataBACK', data);
      // data.sort
      $scope.MaxArtist = data.Artist[0].MaxArtist;
      $scope.MaxArtistArt = data.Artist[0].MaxArtistArt;
      $scope.MaxArtistPlays = data.Artist[0].MaxArtistPlays;
      $scope.MaxSong = data.Song[0].MaxSong;
      $scope.MaxSongArtist = data.Song[0].MaxSongArtist;
      $scope.MaxSongPlays = data.Song[0].MaxSongPlays;
      $scope.MaxSongArt = data.Song[0].MaxSongArt;
      $scope.minutes = Math.round(data.minutes);
      $scope.username = data.username;
      $scope.total = data.total;
      $scope.Artist = data.Artist;
      $scope.Song = data.Song;
    }).error(function(data) {
      console.log('errors', data);
    });
});

app.controller('dashArea', function($scope, $http) {
});
