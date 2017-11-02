/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  const LOGIN_URI_FORMAT = 'https://api.twitch.tv/kraken/oauth2/authorize' +
      '?client_id=%s' +
      '&redirect_uri=%s' +
      '&response_type=%s' +
      '&scope=%s&force_verify=true';

  var util = require('util');
  var request = require('request-promise-native');
  var colors = require('colors');
  var $moment = require('moment');

  var $log = require('../lib/log');
  var $config = require('./../config');
  var $persistence = require('../persistence/jsonSorage');
  var $overlaySocket = require('../sockets/')['overlay'];
  var $panelSocket = require('../sockets/')['panel'];
  var $cache = new (require('../util')['cache'])('services/twitch.service');

  var _data = {
    'clientID': $config['twitch']['clientID'],
    'access_token': $persistence.getTwitchAccessToken(),
    'watcher': {
      'started': false,
      'followers': null,
      'channelInfo': null,
      '$$timeout': null,
    }
  };

  _init();

  /* ------------------------------------------- PUBLIC FUNCTIONS --------------------------------------------------- */

  //Set access token
  $this.setAccessToken = function(access_token) {

    //Clear cache...
    $cache.clear();

    $persistence.setTwitchAccessToken(access_token);
    _data['access_token'] = access_token;
  };

  //Gets login URI
  $this.getLoginURI = function() {
    return util.format(LOGIN_URI_FORMAT,
        $config['twitch']['clientID'],
        encodeURIComponent($config['twitch']['redirectURI']),
        encodeURIComponent('token'),
        ['user:read:email', 'chat_login', 'channel_subscriptions'].join('+')
    );
  };

  //Retrieves current user given an access token
  $this.getCurrentUser = async function()  {

    try {
      return (await _v6ApiRequest('https://api.twitch.tv/helix/users/'))['data'][0];
    } catch($$error) {

      //If we have auth error
      if($$error['statusCode'] == 400) {
        return null;
      }
      else {
        throw $$error;
      }
    }

  };

  //Gets current channel
  $this.getChannel = async function(channelId) {
    return _v5ApiRequest('https://api.twitch.tv/kraken/channels/' + channelId);
  };

  //Retrieves current profile
  $this.getUser = async function(userId) {
    return (await _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/?id=' + userId)))['data'][0];
  };

  //Retrieve users info from an array
  $this.getUsers = function(usersId) {
    var _idsString = usersId.join('&id=');
    return _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/?id=' + _idsString));
  };

  //Gets stream info
  $this.getStream = async function(userId) {
    var _streamInfo =  await _v6ApiRequest(util.format('https://api.twitch.tv/helix/streams?user_id=%s', userId));

    if(_streamInfo['data'].length > 0) {
      return _streamInfo['data'][0];
    }
    else {
      return null;
    }
  };

  //Retrieve followers from the user
  $this.getFollowers = async function(userId) {
    return _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/follows?to_id=%s', userId));
  };

  /* ------------------------------------------- PRIVATE FUNCTIONS -------------------------------------------------- */


  //Initialization function
  function _init() {}

  //Twitch api v5 request
  async function _v5ApiRequest(uri) {

    var _cacheEntry = $cache.get(uri);

    //If we have the entry on cache
    if(_cacheEntry) {
      return JSON.parse(_cacheEntry['body']);
    }

    var _requestData = {
      'url':uri,
      'method': 'GET',
      'headers': {
        'Client-ID': _data['clientID'],
        'Accept': 'application/json'
      },
      'resolveWithFullResponse': true
    };

    if(_data['access_token'] != null) {
      _requestData['headers']['Authorization'] = 'OAuth ' + _data['access_token'];
    }

    var $$response = await request(_requestData);

    //Add item to cache, 1s expire time
    $cache.add(uri, $$response, 1000);

    return JSON.parse($$response['body']);
  }

  //Twitch api V6 Request
  async function _v6ApiRequest(uri) {

    var _cacheEntry = $cache.get(uri);

    //If we have the entry on cache
    if(_cacheEntry) {
      return JSON.parse(_cacheEntry['body']);
    }

    var _requestData = {
      'url':uri,
      'method': 'GET',
      'headers': {
        'Client-ID': _data['clientID'],
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'resolveWithFullResponse': true
    };

    if(_data['access_token'] != null) {
      _requestData['headers']['Authorization'] = 'Bearer ' + _data['access_token'];
    }

    var $$response = await request(_requestData);

    //Add item to cache, 1s expire time
    $cache.add(uri, $$response, 1000);

    //Extract info about twith api limits
    var _limit = $$response['headers']['ratelimit-limit'];
    var _currentLimit = $$response['headers']['ratelimit-remaining'];
    var _expiration = $moment($$response['headers']['ratelimit-reset'] * 1000);

    if(_currentLimit < 20) {
      $log.debug('%s there are %s requests until', colors.yellow('WARNING'), _currentLimit, colors.green(_expiration.format('HH:mm:ss')));
    }

    return JSON.parse($$response['body']);
  }

})();