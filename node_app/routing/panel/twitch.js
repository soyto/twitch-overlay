/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $persistence = require('../../persistence/jsonSorage');
  var $services = require('./../../services');

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

    $$q = $$q.then(() => {
      return $twitchService.getTokenInfo().then(function($$response) {
        var _$$responseData = JSON.parse($$response);
        _resultData['user'] = _$$responseData['token']['user_id'];
      });
    });

    $$q = $$q.then(() => {
      return $twitchService.getUser(_resultData['user']).then(function($$response) {
        var _$$responseData = JSON.parse($$response);
        _resultData['user'] = _$$responseData['data'][0];
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
        'followers': JSON.parse($$response)
      });

    }).catch(($$error) => {
      res.end();
    });

  });

  //Logins on twitch
  router.get('/login', (req, res) => {
    $persistence.setTwitchAccessToken(req['query']['access_token']);
    res.end();
  });

  return router;
})();