/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $persistence = require('../../persistence/jsonSorage');
  var $twitchService = require('./../../services')['twitch'];
  var $twitchWatcherService = require('./../../services')['twitch.watcher'];
  var $overlaySocket = require('../../sockets/')['overlay'];

  //Get window data
  router.get('/', async (req, res) => {

    var _resultData = {
      'loginURI': $twitchService.getLoginURI(),
      'user': null,
      'channel': null,
      'stream': null
    };

    try {
      _resultData['user'] = await $twitchService.getCurrentUser();

      //If current user isn't null
      if(_resultData['user'] != null) {
        _resultData['channelInfo'] = await $twitchService.getChannel(_resultData['user']['login']);
        _resultData['stream'] = await $twitchService.getStream(_resultData['user']['id']);
      }

      res.json(_resultData);
    } catch($error) {
      console.error($error['message']);
      res.json(_resultData);
    }
  });

  //Logins on twitch
  router.get('/login', async (req, res) => {
    $twitchService.setAccessToken(req['query']['access_token']);
    $twitchWatcherService.start();
    res.end();
  });

  //Gets last follower
  router.get('/last-follower', async(req, res) => {

    try {

      var _currentUser = await $twitchService.getCurrentUser();

      if(_currentUser == null) {
        res.json(null);
        return;
      }

      var _followers = (await $twitchService.getFollowers(_currentUser['id']))['data'];

      if(!_followers || !_followers.length) {
        res.json(null);
        return;
      }

      let _lastFollower = await $twitchService.getUser(_followers[0]['from_id']);
      res.json(_lastFollower);

    } catch($$error) {
      console.error($$error['message']);
      res.json($$error);
    }

  });

  //Simulate that we have a new follower
  router.post('/simulate/newFollower', (req, res) => {
    $overlaySocket.twitch_newFollower(req['body']);
    res.end();
  });

  return router;
})();