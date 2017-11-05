/* global */
module.exports = new (function() {
  var $this = this;

  const FILE = './data/profile.json';

  var grunt = require('grunt');

  var $config = require('../config');

  var _data = {
    'twitch': {
      'access_token': null,
    },
    'twitter': {
      'request_token': {
        'token': null,
        'secret': null
      },
      'access_token': {
        'token': null,
        'secret': null
      },
      'scheduled_tweets': []
    },
    'window': {
      'width': 1920,
      'height': 1080
    }
  };

  if(grunt.file.exists(FILE)) {
    _data = Object.assign(_data, grunt.file.readJSON(FILE));
  }


  //Window
  $this.window = new (function() {
    var $$this = this;

    //Gets window data
    $$this.get = function() {
      return _data['window'];
    };

    //Sets window data
    $$this.set = function(width, height) {
      _data['window']['width'] = width;
      _data['window']['height'] = height;

      _persist();
    };

  })();

  //Twitch
  $this.twitch = new (function() {
    var $$this = this;

    //Get access token
    $$this.getAccessToken = function() {
      return _data['twitch']['access_token'];
    };

    //Set access token
    $$this.setAccessToken = function(token) {
      _data['twitch']['access_token'] = token;

      _persist();
    };

  })();

  //Twitter
  $this.twitter = new (function() {
    var $$this = this;

    //Get oauthRequest token
    $$this.getOAuthRequestToken = function() {
      return _data['twitter']['request_token'];
    };

    //Set oauth request token
    $$this.setOAuthRequestToken = function(token) {
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

    //Get oauht token
    $$this.getOAuthToken = function() {
      return _data['twitter']['access_token'];
    };

    //Set oauth token
    $$this.setOAuthToken = function(token) {
      if(token == null) {
        _data['twitter']['access_token']['token'] = null;
        _data['twitter']['access_token']['secret'] = null;
      }
      else {
        _data['twitter']['access_token']['token'] = token['token'];
        _data['twitter']['access_token']['secret'] = token['secret'];
      }

      _persist();
    };

    //Get scheduled tweets
    $$this.getScheduledTweets = function() {
      //Shallow copy of info that we have stored
      return Object.assign([], _data['twitter']['scheduled_tweets']);
    };

    //Set what are the scheduled tweets
    $$this.setScheduledTweets = function(scheduledTweets) {
      _data['twitter']['scheduled_tweets'] = Object.assign([], scheduledTweets);
      _persist();
    };

  })();

  //Persists data on storage
  function _persist() {
    var _txt = $config['persist']['pretty_print'] ? JSON.stringify(_data, null, 1) : JSON.stringify(_data);
    grunt.file.write(FILE, _txt);
  }

})();