/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $overlaySocket = require('../../sockets/overlay.socket');

  //Get window data
  router.get('/', (req, res) => {
    res.json($persistence.getWindowData());
  });

  //Sets data
  router.post('/', (req, res) => {
    var _title = req['body']['title'];
    var _body = req['body']['body'];

    $log.debug('Sending notification [%s]: %s', _title, _body);

    $overlaySocket.sendNotification({
      'title': _title,
      'body': _body
    });

    res.end();
  });

  return router;
})();