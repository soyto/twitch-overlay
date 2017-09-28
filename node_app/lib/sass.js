module.exports = new (function () {
  'use strict';

  var $this = this;

  var fs = require('fs');
  var colors = require('colors');
  var grunt = require('grunt');
  var sass = require('node-sass');

  var $log = require('./log');
  var $overlaySocket = require('./../sockets/overlay.socket');


  var _panelWatcher = null;
  var _overlayWathcer = null;
  var _commonWatcher = null;

  //sass panel
  $this.panel = function () {
    sass.render({
      'file': 'public/assets/sass/panel/panel.scss'
    }, (err, result) => {

      if (err != null) {
        $log.error(err);
        return;
      } 

      $log.debug('Panel sass executed');
      grunt.file.write('public/assets/dist/panel.min.css', result.css);
      });

    return $this;
  };

  $this.panel_watch = function () {
    var _panelAppTimeout = null;

    //Watch changes on panel
    _panelWatcher = fs.watch('public/assets/sass/panel', () => {

      if (_panelAppTimeout != null) { return; }

      _panelAppTimeout = setTimeout(() => {
        $this.panel();
        _panelAppTimeout = null;
      }, 500);

    });

    return $this;
  };

  //Sass overlay
  $this.overlay = function () {
    sass.render({
      'file': 'public/assets/sass/overlay/overlay.scss'
    }, (err, result) => {

      if (err != null) {
        $log.error(err);
        return;
      }

      $log.debug('Overlay sass executed');
      grunt.file.write('public/assets/dist/overlay.min.css', result.css);
      $overlaySocket.reload();
    });

    return $this;
  };

  $this.overlay_watch = function () {
    var _panelAppTimeout = null;

    //Watch changes on panel
    _panelWatcher = fs.watch('public/assets/sass/overlay', () => {

      if (_panelAppTimeout != null) { return; }

      _panelAppTimeout = setTimeout(() => {
        $this.overlay();
        _panelAppTimeout = null;
      }, 500);

    });

    return $this;
  };

  $this.common_watch = function () {
    var _timeout = null;

    //Watch changes on panel
    _commonWatcher = fs.watch('public/assets/sass/common', () => {

      if (_timeout != null) { return; }

      _timeout = setTimeout(() => {
        $this.panel().overlay();
        _timeout = null;
      }, 500);

    });

    return $this;
  };

  //Start watchers
  $this.startWatchers = function () {
    return $this.panel_watch().overlay_watch().common_watch();
  };

  //Stop watchers
  $this.stopWatchers = function () {
    if (_panelWatcher != null) { _panelWatcher.close(); }
    if (_overlayWathcer != null) { _overlayWathcer.close(); }
    if (_commonWatcher != null) { _commonWatcher.close(); }
  };

});