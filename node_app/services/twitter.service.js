/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
  const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';

  var OAuth = require('OAuth')['OAuth'];
  var util = require('util');

  var $config = require('../config');
  var $persistence = require('../persistence/jsonSorage');

  var _oa = new OAuth(
      REQUEST_TOKEN_URL,
      ACCESS_TOKEN_URL,
      $config['twitter']['CONSUMER_KEY'],
      $config['twitter']['CONSUMER_SECRET'],
      '1.0A',
      null,
      'HMAC-SHA1'
  );

  //Generates request token
  $this.generateRequestToken = function() {
    return new Promise((resolve, reject) => {
      _oa.getOAuthRequestToken({'x_auth_access_type': 'write'}, (error, oauthToken, oauthTokenSecret, result) => {

        $persistence.storeOAuthRequestToken({
          'token': oauthToken,
          'secret': oauthTokenSecret
        });

        resolve(util.format('https://api.twitter.com/oauth/authorize?oauth_token=%s', oauthToken));
      });
    });
  };


})();