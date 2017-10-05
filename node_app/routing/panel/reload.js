/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $persistence = require('../../persistence/jsonSorage');
  var $overlaySocket = require('../../sockets/overlay.socket');

  //Get window data
  router.post('/', (req, res) => {
    $overlaySocket.reload();
    res.end();
  });

  return router;
})();