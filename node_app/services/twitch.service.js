/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  const LOGIN_URI_FORMAT = 'https://api.twitch.tv/kraken/oauth2/authorize' +
      '?client_id=%s' +
      '&redirect_uri=%s' +
      '&response_type=%s' +
      '&scope=%s';

  var util = require('util');
  var request = require('request-promise-native');

  var $log = require('../lib/log');
  var $config = require('./../config');
  var $persistence = require('../persistence/jsonSorage');
  var $overlaySocket = require('../sockets/overlay.socket');

  var _firstCallFollowers = null;
  var _currentUserId = null;
  var _$$interval = null;

  _init();

  //Gets login URI
  $this.getLoginURI = function() {
    return util.format(LOGIN_URI_FORMAT,
        $config['twitch']['clientID'],
        encodeURIComponent($config['twitch']['redirectURI']),
        encodeURIComponent('token'),
        encodeURIComponent([].join(','))
    );
  };

  //Retrieves root data info from a token
  $this.getTokenInfo = function() {

    var _clientId = $config['twitch']['clientID'];
    var _access_token = $persistence.getTwitchAccessToken();

    var _requestData = {
      'url': 'https://api.twitch.tv/kraken/',
      'method': 'GET',
      'headers': {
        'Client-ID': _clientId,
        'Authorization': 'OAuth ' + _access_token,
        'Accept': 'application/vnd.twitchtv.v5+json'
      }
    };

    return request(_requestData).then(($$response) => JSON.parse($$response));
  };

  //Retrieves current profile
  $this.getUser = function(userId) {
    return _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/?id=' + userId));
  };

  //Retrieve users info from an array
  $this.getUsers = function(usersId) {
    var _idsString = usersId.join('&id=');
    return _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/?id=' + _idsString));
  };

  //Retrieve followers from the user
  $this.getFollowers = function(userId) {
    return _getFollowers(userId);
  };

  //Watch followers
  $this.watchFollowers = function(userId) {
    _watchFollowers(userId);
  };

  //Stop watching followers
  $this.stopWatchFollowers = function() {
    _stopWatchFollowers();
  };

  //Initilization function
  function _init() {
    if($persistence.getTwitchCurrentUserId() != null) {
      _watchFollowers($persistence.getTwitchCurrentUserId());
    }
  }

  //Watch followers
  function _watchFollowers(userId) {

    //If we have an interval, stop watchin new followers
    if(_$$interval != null) { _stopWatchFollowers(); }

    _currentUserId = userId;

    _checkNewFollowers();
    _$$interval = setInterval(_checkNewFollowers, 5000);
  }

  function _stopWatchFollowers() {
    clearInterval(_$$interval);
  }

  //Check if there are new followers
  function _checkNewFollowers() {
    _getFollowers(_currentUserId).then(function($$responseData) {

      if(_firstCallFollowers == null) {
        _firstCallFollowers = $$responseData['data'];
        return;
      }

      var _newFollowers = [];

      $$responseData['data'].forEach(function($$nFollower) {
        var _exists = false;
        _firstCallFollowers.forEach(function($$oFollower) {
          if(_exists) { return; }

          if($$nFollower['from_id'] == $$oFollower['from_id']) {
            _exists = true;
          }
        });

        if(!_exists) {
          _newFollowers.push($$nFollower);
        }
      });

      //No new followers, dont do nothing
      if(_newFollowers.length === 0) { return; }

      //Append new followers
      _newFollowers.forEach(function($$follower){
        _firstCallFollowers.push($$follower);
      });

      //New users
      return $this.getUsers(_newFollowers.map((x) => x['from_id'])).then(function($$responseData) {
        $$responseData['data'].forEach(function($$newFollower) {
          $log.debug('Twitch API: new follower %s', $$newFollower['display_name']);
          $overlaySocket.twitch_newFollower($$newFollower);
        });

      });
    });
  }

  //Retrieve twittch followers from user
  function _getFollowers(userId) {
    return _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/follows?to_id=%s', userId));
  }

  //Twitch api V6 Request
  function _v6ApiRequest(uri) {
    var _clientId = $config['twitch']['clientID'];
    var _access_token = $persistence.getTwitchAccessToken();

    var _requestData = {
      'url':uri,
      'method': 'GET',
      'headers': {
        'Client-ID': _clientId,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'resolveWithFullResponse': true
    };

    if(_access_token != null) {
      _requestData['headers']['Authorization'] = 'OAuth ' + _access_token;
    }

    return request(_requestData).then(($$response) => {

      //Extract info about twith api limits
      var _limit = $$response['headers']['ratelimit-limit'];
      var _currentLimit = $$response['headers']['ratelimit-remaining'];
      var _expiration = new Date($$response['headers']['ratelimit-reset'] * 1000);
      var _remainingTime = Math.floor((_expiration.getTime() - (new Date()).getTime()) / 1000);


      //$log.debug('%s messages remaining in %s seconds remaining', _currentLimit, _remainingTime);


      return JSON.parse($$response['body']);
    });
  }

})();