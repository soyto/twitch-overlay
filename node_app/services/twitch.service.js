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
  var $cache = require('../util')['cache'];

  var _data = {
    'currentUser': null,
    'watcher': {
      'started': false,
      'followers': null,
      'channelInfo': null,
      '$$timeout': null,
    }
  };

  _init();

  //Gets login URI
  $this.getLoginURI = function() {
    return util.format(LOGIN_URI_FORMAT,
        $config['twitch']['clientID'],
        encodeURIComponent($config['twitch']['redirectURI']),
        encodeURIComponent('token'),
        ['user:read:email', 'chat_login'].join('+')
    );
  };

  //Retrieves current user given an access token
  $this.getCurrentUser = async function()  {
    const CACHE_ENTRY = 'twitch.service.getCurrentUser';

    var _cacheEntry = $cache.get(CACHE_ENTRY);

    if(_cacheEntry == null) {
      let _value = (await _v6ApiRequest('https://api.twitch.tv/helix/users/'))['data'][0];

      $cache.add(CACHE_ENTRY, _value, 5000);
      _data['currentUser'] = _value;

      return Promise.resolve(_value);
    }
    else {
      return Promise.resolve(_cacheEntry);
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

  //Retrieve users info from an array
  $this.getUsers = function(usersId) {
    var _idsString = usersId.join('&id=');
    return _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/?id=' + _idsString));
  };

  //Retrieve followers from the user
  $this.getFollowers = async function(userId) {
    return _v6ApiRequest(util.format('https://api.twitch.tv/helix/users/follows?to_id=%s', userId));
  };

  //Starts watcher
  $this.startWatch = function() {
    _startWatch();
  };

  //Stops watching
  $this.stopWatch = function() {
    _stopWatch();
  };

  //Stop watching followers
  $this.stopWatchFollowers = function() {
    _stopWatchFollowers();
  };

  //Initialization function
  function _init() {}

  //Start watcher
  async function _startWatch() {
    const _ITERATION_TIMEOUT = 500;

    //If watcher was already started
    if(_data['watcher']['started']) {
      _stopWatch();
    }

    _data['watcher']['started'] = true;

    var _user = _data['currentUser'];

    //If there is not current user info try to retrieve it
    if(_user == null) {
      _user = await $this.getCurrentUser();
      if(_user == null) { return _stopWatch(); }
    }

    var _iterationCount = 0;
    var _iterationMethods = [
      _watchIteration_newFollowers,
      _watchIteration_channelInfo,
      _watchIteration_streamInfo
    ];

    //call to iteration
    _iteration();


    //Iterate
    async function _iteration() {
      try {
        await _iterationMethods[_iterationCount % _iterationMethods.length]();

        _iterationCount++;
        _data['watcher']['$$timeout'] = setTimeout(_iteration, _ITERATION_TIMEOUT); //Iterate ever second
      } catch($$error) {
        console.error($$error['message']);
        _iterationCount++;
        _data['watcher']['$$timeout'] = setTimeout(_iteration, _ITERATION_TIMEOUT); //Iterate ever second
      }

    }

  }

  //Stop watch
  function _stopWatch() {
    _data['watcher']['started'] = false;
    if(_data['watcher']['$$timeout'] != null) {
      clearTimeout(_data['watcher']['$$timeout']);
    }
  }

  //Check if there are new followers
  async function _watchIteration_newFollowers() {
    var _watcherData = _data['watcher'];
    var _newFollowers = [];
    var _followersData = (await $this.getFollowers(_data['currentUser']['id']))['data'];

    if (_watcherData['followers'] == null) {
      _watcherData['followers'] = _followersData;
      return;
    }

    _followersData.forEach(function ($$nFollower) {
      let _exists = false;
      _watcherData['followers'].forEach(function ($$oFollower) {
        if (_exists) {
          return;
        }

        if ($$nFollower['from_id'] == $$oFollower['from_id']) {
          _exists = true;
        }
      });

      if (!_exists) {
        _newFollowers.push($$nFollower);
      }
    });

    //No new followers, dont do nothing
    if (_newFollowers.length === 0) {
      return;
    }

    //Append new followers
    _newFollowers.forEach(function ($$follower) {
      _watcherData['followers'].push($$follower);
    });

    var _users = await $this.getUsers(_newFollowers.map((x) => x['from_id']));

    _users['data'].forEach(function ($$newFollower) {
      $log.debug('Twitch API: new follower %s', $$newFollower['display_name']);
      $overlaySocket.twitch_newFollower($$newFollower);
    });

  }

  //Check if there are new news on channelInfo
  async function _watchIteration_channelInfo() {
    var _watcherData = _data['watcher'];

    var _channelInfo = await $this.getChannel(_data['currentUser']['login']);

    if(_watcherData['channelInfo'] == null) {
      _watcherData['channelInfo'] = _channelInfo;
      return;
    }

    $panelSocket.pushTwitchChannelInfo(_channelInfo);
  }

  //Check if there are changes on stream info
  async function _watchIteration_streamInfo() {
    var _watcherData = _data['watcher'];

    var _streamInfo = await $this.getStream(_data['currentUser']['id']);
    $panelSocket.pushTwitchStreamStatus(_streamInfo);
  }

  //Twitch api v5 request
  async function _v5ApiRequest(uri) {
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

    var $$response = await request(_requestData);

    return JSON.parse($$response['body']);
  }

  //Twitch api V6 Request
  async function _v6ApiRequest(uri) {
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
      _requestData['headers']['Authorization'] = 'Bearer ' + _access_token;
    }

    var $$response = await request(_requestData);

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