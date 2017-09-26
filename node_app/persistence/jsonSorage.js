/* global */
module.exports = new (function() {
  var $this = this;

  const FILE = './data/profile.json';

  var grunt = require('grunt');

  var _data = null;


  if(grunt.file.exists(FILE)) {
    _data = grunt.file.readJSON(FILE);
  }
  else {
    _data = {
      'window': {
        'width': 1920,
        'height': 1080
      }
    };
  }

  //Gets window data
  $this.getWindowData = function() {
    return _data['window'];
  };

  //Stores window data
  $this.setWindowData = function(width, height) {
    _data['window']['width'] = width;
    _data['window']['height'] = height;

    _persist();
  };


  //Persists data on storage
  function _persist() {
    grunt.file.write(FILE, JSON.stringify(_data));
  }

})();