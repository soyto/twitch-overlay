/* global */
(function () {
  'use strict';

  var fs = require('fs');
  var colors = require('colors');
  var grunt = require('grunt');
  var express = require('express');
  var app = express();
  var server = require('http').Server(app);

  var $log = require('./node_app/lib/log');
  var $uglify = require('./node_app/lib/uglify');
  var $sass = require('./node_app/lib/sass');
  var $storage = require('./node_app/persistence/jsonSorage');
  var $overlaySocket = require('./node_app/sockets/overlay.socket');

  $overlaySocket.init(server);

  app.use('/', express.static('public'));

  //When user acess overlay
  app.get('/overlay', (req, res) => {
    res.set('Content-type', 'text/html; charset=UTF-8');
    res.send(grunt.file.read('public/overlay.html'));
  });

  //Uglify files
  $uglify.panel().overlay().startWatchers();

  //Sass
  $sass.panel().overlay().startWatchers();

  //Panel routing
  app.use('/v1/panel', require('./node_app/routing/panel'));
  app.use('/v1/overlay', require('./node_app/routing/overlay'));

  server.listen(80, function () {
    $log.debug('Server start in port %s', colors.cyan(80));
  });
})();
