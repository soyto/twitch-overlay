/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $persistence = require('../../persistence/jsonSorage');
  var $overlaySocket = require('../../sockets/overlay.socket');

  //Get window data
  router.get('/', (req, res) => {
    res.json($persistence.getWindowData());
  });

  //Sets data
  router.post('/', (req, res) => {
    $persistence.setWindowData(req['body']['width'], req['body']['height']);
    $overlaySocket.setWindow(req['body']['width'], req['body']['height']);
    res.end();
  });

  return router;
})();