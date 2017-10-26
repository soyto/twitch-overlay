/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
  const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
  const PRINT_TWITTER_LIMITS = false;
  const BASE_URL = 'https://api.twitter.com/1.1/';


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
  //Gets an user
  $this.getUser = function(userId) {
    var _url = 'users/show.json?user_id=' + userId;

    //store items in cache about 1 min
    return _oauth_get(_url, 1000 * 60);
  };

  //Get followers
  $this.getFollowers = function() {
    //Followers cache: 15 each 15 min
    return _oauth_get('followers/list.json', 1000 * 60);
  };

  //Get mentions
  $this.getMentions = function() {
    //Mentions cache: 75 each 15 min
    return _oauth_get('statuses/mentions_timeline.json', 1000 * 12);
  };

  //Get retweets
  $this.getRetweets = function(num) {
    var _url = 'statuses/retweets_of_me.json?stringify_ids=true';

    if(num) { _url += '&count=' + num; }

    //Retweets cache: 75 each 15 min
    return _oauth_get(_url, 1000 * 12);
  };

  //Get tweet retweets from the specified retweet
  $this.getTweetRetweeters = function(tweetId) {
    var _url = util.format('statuses/retweeters/ids.json?stringify_ids=true&id=', tweetId);

    //Retweets cache: 75 each 15 min
    return _oauth_get(_url, 1000 * 12);
  };

  //verify user credentials
  $this.verifyCredentials = function() {
    return _oauth_get('account/verify_credentials.json');
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

    var _entry = $cache.get(BASE_URL + url);

    //If we have cache
    if(_entry) { return _entry; }

    //No token.. return null
    if(!_data['token']['token'] || !_data['token']['secret']) { return null; }

    return new Promise((resolve, reject) => {
      _oa.get(BASE_URL +  url, _data['token']['token'], _data['token']['secret'], (error, data, response) => {

        if(error) {
          reject(error);
          return null;
        }

        var _limitRemaining = response['headers']['x-rate-limit-remaining'];
        var _limitReset = response['headers']['x-rate-limit-reset'];
        var _limitResetDate = $moment(_limitReset * 1000);

        if(PRINT_TWITTER_LIMITS) {
          $log.debug('Twitter API: Endpoint [%s]: %s until %s',
              colors.cyan(url),
              colors.red(_limitRemaining),
              colors.cyan(_limitResetDate.format('HH:mm:SS')));
        }


        var _entry = JSON.parse(data);

        $cache.add(url, _entry, cacheTime);
        resolve(_entry);
      });
    });
  }

})();