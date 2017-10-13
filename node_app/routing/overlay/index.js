/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var router = express.Router();
  var $persistence = require('../../persistence/jsonSorage');
  var $services = require('../../services');

  var $twitchService = $services.getTwitchService();

  //panel middleware
  router.use(bodyParser.json());

  router.get('/', async ($$req, $$res) => {

    let _responseData = {
      'window': $persistence.getProfile()['window'],
      'twitch': {
        'last_follower': null
      }
    };

    let _twitchUserId = $persistence.getTwitchCurrentUserId();

    //If twitch user id isnt null
    if(_twitchUserId != null) {
      let _followers = (await $twitchService.getFollowers(_twitchUserId))['data'];

      if(_followers.length > 0) {

        _followers.sort((a, b) => {
          var da = new Date(a['followed_at']);
          var db = new Date(b['followed_at']);

          return db.getTime() - da.getTime();
        });

        let _lastFollower = _followers[0];
        _responseData['twitch']['last_follower'] = await $twitchService.getUser(_lastFollower['from_id']);
      }
    }

    $$res.json(_responseData);
  });

  return router;
})();