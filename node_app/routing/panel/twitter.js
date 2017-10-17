/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $persistence = require('../../persistence/jsonSorage');
  var $twitterService = require('./../../services')['twitter'];


  router.get('/token', async (req, res) => {
    var _accessURI = await $twitterService.generateRequestToken();

    res.send({
      'uri': _accessURI
    });
  });

  return router;

})();