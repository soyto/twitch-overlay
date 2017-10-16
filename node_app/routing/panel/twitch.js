/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $persistence = require('../../persistence/jsonSorage');
  var $services = require('./../../services');
  var $overlaySocket = require('../../sockets/')['overlay'];

  var $twitchService = $services.getTwitchService();

  //Get window data
  router.get('/', async (req, res) => {

    var _accessToken = $persistence.getTwitchAccessToken();

    var _resultData = {
      'loginURI': $twitchService.getLoginURI(),
      'user': null,
      'channel': null,
      'stream': null
    };

    //If there is not valid access_token
    if(_accessToken == null) {
      return res.json(_resultData);
    }

    try {

      _resultData['user'] = await $twitchService.getCurrentUser();
      _resultData['channelInfo'] = await $twitchService.getChannel(_resultData['user']['login']);
      _resultData['stream'] = await $twitchService.getStream(_resultData['user']['id']);

      res.json(_resultData);
    } catch($error) {
      console.error($error['message']);
      res.json(_resultData);
    }
  });

  //Logins on twitch
  router.get('/login', async (req, res) => {
    $persistence.setTwitchAccessToken(req['query']['access_token']);
    let _user = await $twitchService.getCurrentUser();
    $persistence.setTwitchCurrentUserId(_user['id']);
    $twitchService.startWatch();
    res.end();
  });


  router.post('/simulate/newFollower', (req, res) => {
    $overlaySocket.twitch_newFollower(req['body']);
    res.end();
  });

  return router;
})();