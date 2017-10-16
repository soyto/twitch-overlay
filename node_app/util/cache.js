(function() {

  var $moment = require('moment');

  function Cache() {
    var $this = this;

    var _entries = {};

    //Adds an item to cache
    $this.add = function(entryName, value, expirationTime) {

      if(expirationTime == null) { expirationTime = 1000; }

      var _expiration = $moment().add({'seconds': expirationTime});
      var _entry = {
        'value': value,
        'expiration': _expiration
      };

      if(_entries[entryName] != null) {
        delete _entries[entryName];
      }


      _entries[entryName] = _entry;
    };

    //Gets an entry
    $this.get = function(entryName) {

      if(_entries[entryName] == null) { return null; }

      var _entry = _entries[entryName];

      if($moment().isAfter(_entry['expiration'])) { return null; }

      return _entry['value'];
    };

  }

  module.exports = new Cache();
})();