/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
  const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';

  var colors = require('colors');
  var OAuth = require('oauth')['OAuth'];
  var util = require('util');
  var $moment = require('moment');

  var $log = require('../lib/log');
  var $config = require('../config');
  var $persistence = require('../persistence/jsonSorage');
  var $cache = new (require('../util')['cache']);

  var _data = {
    'token': {
      'token': null,
      'secret': null
    }
  };
  var _oa = null;

  _init();

  /* ------------------------------------------- PUBLIC FUNCTIONS --------------------------------------------------- */

  //Get followers
  $this.getFollowers = function() {
    //Followers cache: 15 each 15 min
    return _oauth_get('https://api.twitter.com/1.1/followers/list.json', 1000 * 60);
  };

  //Get mentions
  $this.getMentions = function() {
    //Mentions cache: 75 each 15 min
    return _oauth_get('https://api.twitter.com/1.1/statuses/mentions_timeline.json', 1000 * 12);
  };

  //verify user credentials
  $this.verifyCredentials = async function() {

    try {
      return await _oauth_get('https://api.twitter.com/1.1/account/verify_credentials.json');
    } catch($$error) {
      console.error($$error);
      return null;
    }
  };

  //
  // AUTHORIZATION
  // ----------------------

  //Generates request token
  $this.generateRequestToken = function() {
    return new Promise((resolve, reject) => {
      _oa.getOAuthRequestToken({'x_auth_access_type': 'write'}, (error, oauthToken, oauthTokenSecret, result) => {

        $persistence.storeOAuthTwitterRequestToken({
          'token': oauthToken,
          'secret': oauthTokenSecret
        });

        resolve(util.format('https://api.twitter.com/oauth/authorize?oauth_token=%s', oauthToken));
      });
    });
  };

  //Verify request token
  $this.verifyRequestToken = function(requestToken, requestSecret, requestVerify) {
    return new Promise((resolve, reject) => {
      _oa.getOAuthAccessToken(requestToken, requestSecret, requestVerify, function (error, oAuthToken, oAuthSecretToken) {
        $persistence.storeOAuthTwitterRequestToken(null);

        _data['token']['token'] = oAuthToken;
        _data['token']['secret'] = oAuthSecretToken;

        $persistence.storeOauthTwitterToken({
          'token': oAuthToken,
          'secret': oAuthSecretToken
        });

        resolve();
      });
    });
  };

  /* ------------------------------------------- PRIVATE FUNCTIONS -------------------------------------------------- */

  //nit function
  function _init() {

    if($persistence.getOauthTwitterToken() != null) {
      let _token = $persistence.getOauthTwitterToken();
      _data['token']['token'] = _token['token'];
      _data['token']['secret'] = _token['secret'];
    }

    _oa = new OAuth(
        REQUEST_TOKEN_URL,
        ACCESS_TOKEN_URL,
        $config['twitter']['CONSUMER_KEY'],
        $config['twitter']['CONSUMER_SECRET'],
        '1.0A',
        null,
        'HMAC-SHA1'
    );
  }

  //GET from Oauth
  async function _oauth_get(url, cacheTime = 60000) {


    var _entry = $cache.get(url);

    //If we have cache
    if(_entry) { return _entry; }

    //No token.. return null
    if(!_data['token']['token'] || !_data['token']['secret']) { return null; }

    return new Promise((resolve, reject) => {
      _oa.get(url, _data['token']['token'], _data['token']['secret'], (error, data, response) => {

        if(error) {
          reject(error);
          return null;
        }

        var _limitRemaining = response['headers']['x-rate-limit-remaining'];
        var _limitReset = response['headers']['x-rate-limit-reset'];
        var _limitResetDate = $moment(_limitReset * 1000);

        /*$log.debug('Twitter API: Endpoint [%s]: %s until %s',
          colors.cyan(url),
          colors.red(_limitRemaining),
          colors.magenta(_limitResetDate.format('HH:mm:SS')));*/

        var _entry = JSON.parse(data);

        $cache.add(url, _entry, cacheTime);
        resolve(_entry);
      });
    });
  }

})();