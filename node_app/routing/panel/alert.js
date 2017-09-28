/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $overlaySocket = require('../../sockets/overlay.socket');

  //Get window data
  router.get('/', (req, res) => {
    res.json($persistence.getWindowData());
  });

  //Sets data
  router.post('/', (req, res) => {
    $overlaySocket.sendAlert({
      'title': req['body']['title'],
      'text': req['body']['text']
    });
  });

  return router;
})();