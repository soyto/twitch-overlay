/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $persistence = require('../../persistence/jsonSorage');
  var $twitterService = require('./../../services')['twitter'];


  router.get('/verify', async(req, res) => {
    var _verify = await $twitterService.verifyCredentials();
    res.json(_verify);
  });

  //Get access token
  router.get('/access_token', async(req, res) => {
    var _request_token = req.query.oauth_token;
    var _request_verify = req.query.oauth_verifier;

    var _token = $persistence.getOAuthTwitterRequestToken();

    if(_request_token != _token['token']) {
      res.redirect('/');
      return;
    }

    await $twitterService.verifyRequestToken(_request_token, _token['secret'], _request_verify);

    res.redirect('/');
  });

  //get Token
  router.get('/token', async (req, res) => {
    var _accessURI = await $twitterService.generateRequestToken();

    res.send({
      'uri': _accessURI
    });
  });

  return router;

})();