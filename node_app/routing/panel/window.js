/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $persistence = require('../../persistence/jsonSorage');
  var $overlaySocket = require('../../sockets')['overlay'];

  //Get window data
  router.get('/', (req, res) => {
    res.json($persistence.window.get());
  });

  //Sets data
  router.post('/', (req, res) => {
    $persistence.window.set(req['body']['width'], req['body']['height']);
    $overlaySocket.setWindow(req['body']['width'], req['body']['height']);
    res.end();
  });

  return router;
})();