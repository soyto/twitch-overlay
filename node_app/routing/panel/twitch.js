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

      let _userId = null;

      if($persistence.getTwitchCurrentUserId() != null) {
        _userId = $persistence.getTwitchCurrentUserId();
      }
      else {
        _userId = (await $twitchService.getTokenInfo())['token']['user_id'];
        $persistence.setTwitchCurrentUserId(_userId);
        $twitchService.watchFollowers(_userId);
      }

      _resultData['user'] = await $twitchService.getUser(_userId);
      _resultData['stream'] = await $twitchService.getStream(_userId);



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