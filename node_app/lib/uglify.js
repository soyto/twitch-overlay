/* global */
module.exports = new (function () {
  'use strict';
  var $this = this;

  var chockidar = require('chokidar');
  var uglify = require('uglify-js');
  var grunt = require('grunt');
  var $log = require('./log');

  const PANEL_FOLDER = 'public/assets/panelApp';
  const OVERLAY_FOLDER = 'public/assets/overlayApp';

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

    $log.debug('Panel files uglified');

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

    $log.debug('Overlay files uglified');
    
    return $this;
  };

  //Start watchers
  $this.start = function () {

    _panelWatcher = chockidar.watch(PANEL_FOLDER);
    _overlayWathcer = chockidar.watch(OVERLAY_FOLDER);

    _panelWatcher.on('change', () => $this.panel());
    _overlayWathcer.on('change', () => $this.overlay());

    return $this.panel().overlay();
  };

  //Stop watchers
  $this.stopWatchers = function () {
    if (_panelWatcher != null) { _panelWatcher.close(); }
    if (_overlayWathcer != null) { _overlayWathcer.close(); }
  };

})();