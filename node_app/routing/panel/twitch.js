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
  router.get('/', (req, res) => {

    var _accessToken = $persistence.getTwitchAccessToken();

    var _resultData = {
      'loginURI': $twitchService.getLoginURI(),
      'user': null,
    };

    //If there is not valid access_token
    if(_accessToken == null) {
      return res.json(_resultData);
    }


    var $$q = Promise.resolve();

    if($persistence.getTwitchCurrentUserId() != null) {
      _resultData['user'] = $persistence.getTwitchCurrentUserId();
    }
    else {
      $$q = $$q.then(() => {
        return $twitchService.getTokenInfo().then(function($$response) {
          _resultData['user'] = $$response['token']['user_id'];
          $persistence.setTwitchCurrentUserId($$response['token']['user_id']);
          $twitchService.watchFollowers($$response['token']['user_id']);
        });
      });
    }



    $$q = $$q.then(() => {
      return $twitchService.getUser(_resultData['user']).then(function($$response) {
        _resultData['user'] = $$response['data'][0];
      });
    });

    $$q.then(() => {
      res.json(_resultData);
    });

    $$q.catch(($$rerror) => {
      console.log($$rerror['message']);
      res.json(_resultData);
    });
  });

  //Retrieve followers
  router.get('/followers/', (req, res) => {
    var _userId = req['query']['user_id'];

    $twitchService.getFollowers(_userId).then(($$response) => {
      res.json({
        'followers': $$response
      });
    }).catch(($$error) => {
      console.error($$error);
      res.end();
    });

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