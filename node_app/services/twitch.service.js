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

  var $config = require('./../config');
  var $persistence = require('../persistence/jsonSorage');


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

    return request(_requestData);
  };

  //Retrieves current profile
  $this.getUser = function(userId) {

    var _clientId = $config['twitch']['clientID'];
    var _access_token = $persistence.getTwitchAccessToken();

    var _requestData = {
      'url': util.format('https://api.twitch.tv/helix/users/?id=%s', userId),
      'method': 'GET',
      'headers': {
        'Client-ID': _clientId,
        'Accept': 'application/vnd.twitchtv.v5+json'
      }
    };

    if(_access_token != null) {
      _requestData['headers']['Authorization'] = 'OAuth ' + _access_token;
     }

    return request(_requestData);
  };

})();