/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $persistence = require('../../persistence/jsonSorage');
  var $overlaySocket = require('../../sockets').getOverlaySocket();

  //Get window data
  router.post('/', (req, res) => {
    $overlaySocket.reload();
    res.end();
  });

  return router;
})();