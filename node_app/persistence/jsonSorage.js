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
    'twitter': {
      'request_token': {
        'token': null,
        'secret': null
      },
      'access_token': {
        'token': null,
        'secret': null
      }
    },
    'window': {
      'width': 1920,
      'height': 1080
    }
  };


  if(grunt.file.exists(FILE)) {
    _data = Object.assign(_data, grunt.file.readJSON(FILE));
  }

  //Entrust that twitter.access_token is present
  if(_data['twitter']['access_token'] == null) {
    _data['twitter']['access_token'] = {
      'token': null,
      'secret': null
    };
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

  //Gets oauth request token
  $this.getOAuthTwitterRequestToken = function() {
    return _data['twitter']['request_token'];
  };

  //Stores OAuthr Request token
  $this.storeOAuthTwitterRequestToken = function(token) {

    if(token == null) {
      _data['twitter']['request_token']['token'] = null;
      _data['twitter']['request_token']['secret'] = null;
    }
    else {
      _data['twitter']['request_token']['token'] = token['token'];
      _data['twitter']['request_token']['secret'] = token['secret'];
    }



    _persist();
  };

  //Gets oauth twitter token
  $this.getOauthTwitterToken = function() {
    return _data['twitter']['access_token'];
  };

  //Stores oauth twitter token
  $this.storeOauthTwitterToken = function(token) {
    _data['twitter']['access_token']['token'] = token['token'];
    _data['twitter']['access_token']['secret'] = token['secret'];

    _persist();
  };


  //Persists data on storage
  function _persist() {
    grunt.file.write(FILE, JSON.stringify(_data));
  }

})();