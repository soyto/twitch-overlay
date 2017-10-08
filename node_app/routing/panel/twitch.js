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

    //If there is not valid access_token
    if(_accessToken == null) {
      return res.json({
        'loginURI': $twitchService.getLoginURI()
      });
    }

    $twitchService.getTokenInfo().then(function($$response) {

      var _$$responseData = JSON.parse($$response);
      var _userId = _$$responseData['token']['user_id'];

      return $twitchService.getUser(_userId).then(function($$response) {
        res.json({
          'user': JSON.parse($$response)['data'][0],
          'loginURI': $twitchService.getLoginURI()
        });
      });
    }).catch(function($$response) {
      console.log($$response['message']);
      res.json({
        'loginURI': $twitchService.getLoginURI()
      });
    });
  });

  //Logins on twitch
  router.get('/login', (req, res) => {
    $persistence.setTwitchAccessToken(req['query']['access_token']);
    res.end();
  });

  return router;
})();