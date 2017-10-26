module.exports = new (function () {
  'use strict';

  var $this = this;

  var chockidar = require('chokidar');
  var colors = require('colors');
  var grunt = require('grunt');
  var sass = require('node-sass');

  var $log = require('./log');

  const COMMON_FOLDER = 'public/assets/sass/common';
  const PANEL_FOLDER = 'public/assets/sass/panel';
  const OVERLAY_FOLDER = 'public/assets/sass/overlay';

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

        //$log.debug('Panel sass executed');
        grunt.file.write('public/assets/dist/panel.min.css', result.css);
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

      //$log.debug('Overlay sass executed');
      grunt.file.write('public/assets/dist/overlay.min.css', result.css);
    });

    return $this;
  };

  //Start watchers
  $this.start = function() {

    _commonWatcher = chockidar.watch(COMMON_FOLDER);
    _panelWatcher = chockidar.watch(PANEL_FOLDER);
    _overlayWathcer = chockidar.watch(OVERLAY_FOLDER);

    _commonWatcher.on('change', () => $this.panel().overlay());
    _panelWatcher.on('change', () => $this.panel());
    _overlayWathcer.on('change', () => $this.overlay());

    return $this.panel().overlay();
  };

  //Stop watchers
  $this.stopWatchers = function () {
    if (_panelWatcher != null) { _panelWatcher.close(); }
    if (_overlayWathcer != null) { _overlayWathcer.close(); }
    if (_commonWatcher != null) { _commonWatcher.close(); }
  };

});