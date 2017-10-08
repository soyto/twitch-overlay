/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $overlaySocket = require('../../sockets').getOverlaySocket();

  //Get window data
  router.get('/', (req, res) => {
    res.json($persistence.getWindowData());
  });

  //Sets data
  router.post('/', (req, res) => {
    var _title = req['body']['title'];
    var _body = req['body']['body'];
    var _type = req['body']['type'];

    $log.debug('Sending notification [%s:%s]: %s', _title, _type, _body);

    $overlaySocket.sendNotification({
      'title': _title,
      'body': _body,
      'type': _type
    });

    res.end();
  });

  return router;
})();