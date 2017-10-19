/* global require:false */
(function () {
  'use strict';

  var fs = require('fs');
  var colors = require('colors');
  var express = require('express');
  var app = express();
  var server = require('http').Server(app);

  var $config = require('./node_app/config');
  var $log = require('./node_app/lib/log');
  var $services = require('./node_app/services');

  //Set routing
  app.use('/', require('./node_app/routing'));

  //Start sockets
  require('./node_app/sockets').start(server);

  //Start uglify
  require('./node_app/lib/uglify').start();

  //Start sass
  require('./node_app/lib/sass').start();

  //Start twitch service watcher
  $services['twitch.watcher'].start();

  server.listen($config['server']['port'], function () {
    $log.debug('Server start in port %s', colors.cyan($config['server']['port']));
  });
})();
