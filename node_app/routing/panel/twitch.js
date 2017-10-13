/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $persistence = require('../../persistence/jsonSorage');
  var $services = require('./../../services');
  var $overlaySocket = require('../../sockets/').getOverlaySocket();

  var $twitchService = $services.getTwitchService();

  //Get window data
  router.get('/', async (req, res) => {

    let _accessToken = $persistence.getTwitchAccessToken();

    let _resultData = {
      'loginURI': $twitchService.getLoginURI(),
      'user': null,
    };

    //If there is not valid access_token
    if(_accessToken == null) {
      return res.json(_resultData);
    }

    try {

      if($persistence.getTwitchCurrentUserId() != null) {
        _resultData['user'] = $persistence.getTwitchCurrentUserId();
      }
      else {
        let _tokenInfo = await $twitchService.getTokenInfo();
        _resultData['user'] = $$response['token']['user_id'];
        $persistence.setTwitchCurrentUserId(_tokenInfo['token']['user_id']);
        $twitchService.watchFollowers(_tokenInfo['token']['user_id']);
      }

      _resultData['user'] = (await $twitchService.getUser(_resultData['user']))['data'][0];

      res.json(_resultData);
    } catch($error) {
      console.error($error['message']);
      res.json(_resultData);
    }
  });

  //Logins on twitch
  router.get('/login', (req, res) => {
    $persistence.setTwitchAccessToken(req['query']['access_token']);
    res.end();
  });


  router.post('/simulate/newFollower', (req, res) => {
    $overlaySocket.twitch_newFollower(req['body']);
    res.end();
  });

  return router;
})();