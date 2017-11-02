(function() {

  const CACHE_FOLDER = 'data/cache/';
  const PRETTY_PRINT = false;

  var $moment = require('moment');
  var $is = require('is_js');
  var grunt = require('grunt');
  var $md5 = require('md5');

  var $log = require('../lib/log');

  function Cache(cacheName) {
    var $this = this;

    if(!$is.existy(cacheName) || $is.empty(cacheName)) {
      throw new Error('Usage is new Cache(cacheName)');
    }

    var _fileName = CACHE_FOLDER + $md5(cacheName) + '.json';
    var _entries = {};

    if(grunt.file.exists(_fileName)) {
      _entries = grunt.file.readJSON(_fileName);

      console.log(_entries);
    }

    //Adds an item to cache
    $this.add = function(entryName, value, expirationTime) {

      if(expirationTime == null) { expirationTime = 1000; }

      var _expiration = $moment().add({'milliseconds': expirationTime});

      var _entry = {
        'value': value,
        'expiration': _expiration
      };

      if(_entries[entryName] != null) {
        delete _entries[entryName];
      }

      _entries[entryName] = _entry;

      _persistCache();
    };

    //Gets an entry
    $this.get = function(entryName) {

      if(_entries[entryName] == null) { return null; }

      var _entry = _entries[entryName];

      if($moment().isAfter(_entry['expiration'])) { return null; }

      return _entry['value'];
    };

    //Clear whole cache
    $this.clear = function() {
      _entries = {};

      _persistCache();
    };

    //Persist cache
    function _persistCache() {

      var _txt = PRETTY_PRINT ? JSON.stringify(_entries, null, 1) : JSON.stringify(_entries);

      grunt.file.write(_fileName, _txt);
    }
  }

  module.exports = Cache;
})();