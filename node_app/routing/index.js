/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var grunt = require('grunt');

  router.use('/', express.static('public'));

  //When user acess overlay
  router.get('/overlay', (req, res) => {
    res.set('Content-type', 'text/html; charset=UTF-8');
    res.send(grunt.file.read('public/overlay.html'));
  });

  router.get('/twitch-login/', (req, res) => {
    res.set('Content-type', 'text/html; charset=UTF-8');
    res.send(grunt.file.read('public/twitch-login.html'));
  });

  router.use('/v1/panel', require('./panel'));
  router.use('/v1/overlay', require('./overlay'));

  return router;
})();