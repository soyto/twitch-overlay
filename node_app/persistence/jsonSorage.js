/* global */
module.exports = new (function() {
  var $this = this;

  const FILE = './data/profile.json';

  var grunt = require('grunt');

  var _data = {
    'twitch': {
      'access_token': null,
      'currentUserId': null,
    },
    'window': {
      'width': 1920,
      'height': 1080
    }
  };


  if(grunt.file.exists(FILE)) {
    _data = Object.assign(_data, grunt.file.readJSON(FILE));
  }

  //Returns whole profile
  $this.getProfile = function() {
    return _data;
  };

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

  //Retrieves twitch access token
  $this.getTwitchAccessToken = function() {
    return _data['twitch']['access_token'];
  };

  //Sets wich is twitch access token
  $this.setTwitchAccessToken = function(token) {
    _data['twitch']['access_token'] = token;

    _persist();
  };


  //Persists data on storage
  function _persist() {
    grunt.file.write(FILE, JSON.stringify(_data));
  }

})();