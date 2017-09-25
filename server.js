/* global */
(function () {
  'use strict';

  var fs = require('fs');
  var colors = require('colors');
  var grunt = require('grunt');
  var express = require('express');
  var app = express();

  var $log = require('./node_app/lib/log');
  var $uglify = require('./node_app/lib/uglify');
  var $sass = require('./node_app/lib/sass');

  app.use('/', express.static('public'));

  //When user acess overlay
  app.get('/overlay', (req, res) => {
    res.set('Content-type', 'text/html; charset=UTF-8');
    res.send(grunt.file.read('public/overlay/overlay.html'));
  });

  //Uglify files
  $uglify.panel().overlay().startWatchers();

  //Sass
  $sass.panel().overlay().startWatchers();


  app.get('/v1/overlay/init', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      'width': 800,
      'height': 600
    }));
  });

 

  app.listen(80, function () {
    $log.debug('Server start in port %s', colors.cyan(80));
  });
})();
