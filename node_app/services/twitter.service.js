/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
  const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';

  var OAuth = require('oauth')['OAuth'];
  var util = require('util');

  var $config = require('../config');
  var $persistence = require('../persistence/jsonSorage');

  var _data = {
    'token': {
      'token': null,
      'secret': null
    }
  };

  if($persistence.getOauthTwitterToken() != null) {
    let _token = $persistence.getOauthTwitterToken();
    _data['token']['token'] = _token['token'];
    _data['token']['secret'] = _token['secret'];
  }

  var _oa = new OAuth(
      REQUEST_TOKEN_URL,
      ACCESS_TOKEN_URL,
      $config['twitter']['CONSUMER_KEY'],
      $config['twitter']['CONSUMER_SECRET'],
      '1.0A',
      null,
      'HMAC-SHA1'
  );

  //verify user credentials
  $this.verifyCredentials = function() {
    return _oauth_get('https://api.twitter.com/1.1/account/verify_credentials.json');
  };

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

  function _oauth_get(url, fullResponse = false) {
    return new Promise((resolve, reject) => {
      _oa.get(url, _data['token']['token'], _data['token']['secret'], function(error, data, response) {

        if(error != null) {
          return reject(error);
        }

        if(fullResponse) {
          return resolve(response);
        } else {
          return resolve(JSON.parse(data));
        }

      });
    });
  }

})();