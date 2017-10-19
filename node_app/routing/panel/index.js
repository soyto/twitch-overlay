/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var router = express.Router();
  var $persistence = require('../../persistence/jsonSorage');
  var $twitchWatcherService = require('../../services')['twitch.watcher'];

  //panel middleware
  router.use(bodyParser.json());

  router.use('/notification', require('./notification'));
  router.use('/reload', require('./reload'));
  router.use('/twitch', require('./twitch'));
  router.use('/window', require('./window'));
  router.use('/twitter', require('./twitter'));


  router.use('/logout', async (req, res) => {
    $persistence.setTwitchAccessToken(null);
    $twitchWatcherService.stop();
    res.end();
  });

  return router;
})();