/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var router = express.Router();

  var $overlaySocket = require('./../../sockets/overlay.socket');

  //panel middleware
  router.use(bodyParser.json());

  router.use('/notification', require('./notification'));
  router.use('/reload', require('./reload'));
  router.use('/twitch', require('./twitch'));
  router.use('/window', require('./window'));

  return router;
})();