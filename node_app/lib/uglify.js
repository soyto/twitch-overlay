/* global */
module.exports = new (function () {
  'use strict';
  var $this = this;

  var fs = require('fs');
  var uglify = require('uglify-js');
  var grunt = require('grunt');
  var $log = require('./log');
  var $overlaySocket = require('./../sockets/overlay.socket');

  var _panelWatcher = null;
  var _overlayWathcer = null;


  //Uglify panel sources
  $this.panel = function () {

    var _panelFiles = grunt.file.expand('public/assets/panelApp/**/*.js');

    var _uglifyOpts = {};
    _panelFiles.forEach(function ($$file) {
      _uglifyOpts[$$file] = grunt.file.read($$file);
    });
    var _uglifyResult = uglify.minify(_uglifyOpts, { 'mangle': false });
    grunt.file.write('public/assets/dist/panelApp.min.js', _uglifyResult.code);

    $log.debug('panel files uglified');

    return $this;
  };

  //Watch changes on panel and uglify
  $this.panel_watch = function () {
    var _panelAppTimeout = null;

    //Watch changes on panel
    _panelWatcher = fs.watch('public/assets/panelApp', () => {

      if (_panelAppTimeout != null) { return; }

      _panelAppTimeout = setTimeout(() => {
        $this.panel();
        _panelAppTimeout = null;
      }, 500);

    });

    return $this;

  };

  //Uglify overlay sources
  $this.overlay = function () {

    var _panelFiles = grunt.file.expand('public/assets/overlayApp/**/*.js');

    var _uglifyOpts = {};
    _panelFiles.forEach(function ($$file) {
      _uglifyOpts[$$file] = grunt.file.read($$file);
    });
    var _uglifyResult = uglify.minify(_uglifyOpts, { 'mangle': false });
    grunt.file.write('public/assets/dist/overlayApp.min.js', _uglifyResult.code);

    $log.debug('overlay files uglified');
    
    return $this;
  };

  //Watch changes on panel and uglify
  $this.overlay_watch = function () {
    var _panelAppTimeout = null;

    //Watch changes on panel
    _overlayWathcer = fs.watch('public/assets/overlayApp', () => {

      if (_panelAppTimeout != null) { return; }

      _panelAppTimeout = setTimeout(() => {
        $this.overlay();
        _panelAppTimeout = null;
      }, 500);

    });

    return $this;

  };

  //Start watchers
  $this.startWatchers = function () {
    return $this.panel_watch().overlay_watch();
  };

  //Stop watchers
  $this.stopWatchers = function () {
    if (_panelWatcher != null) { _panelWatcher.close(); }
    if (_overlayWathcer != null) { _overlayWathcer.close(); }
  };

})();