/* global */
module.exports = (function() {
  'strict mode';

  var colors = require('colors');
  var $log = require('./../lib/log');

  var _instance = new (function() {
    var $this = this;

    var _server = null;
    var _io = null;
    var _sockets = [];

    //Initializes socket
    $this.init = function(server) {
      _server = server;
      _io = server.of('/overlay');
      _io.on('connection', _onConnection);
    };



    //Reloads overlay
    $this.reload = function() {
      _io.emit('reload');
    };

    //Sets width to all connected clients
    $this.setWindow = function(width, height) {
      _io.emit('window', {
        'width': width,
        'height': height
      });
    };

    //Sends an alert to the overlay
    $this.sendNotification = function(data) {
      _io.emit('notification', data);
    };


    //Twitter
    $this.twitter = new (function() {
      var $$this = this;

      //Sends a message with the new follower
      $$this.push_newFollower = function(followerData) {
        _io.emit('twitter.follower.new', followerData);
      };

      //Sends an alart to the overlay that there is a new mention
      $$this.push_newMention = function(mentionData) {
        _io.emit('twitter.mention.new', mentionData);
      };

      //On a new retweet
      $$this.push_newRetweet = function(retweetData) {
        _io.emit('twitter.retweet.new', retweetData);
      };

    })();

    //Twitch
    $this.twitch = new (function() {
      var $$this = this;

      //Sends an alert to the overlay that there is a new follower
      $$this.push_newFollower = function(followerData) {
        _io.emit('twitch.follower.new', followerData);
      };

    })();

    //On client connection
    function _onConnection(socket) {
      _sockets.push(socket);
      socket.on('disconnect', _onDisconnect);
    }

    //On client disconnection
    function _onDisconnect() {
      var socket = this;
      _sockets.splice(_sockets.indexOf(socket), 1);
    }

  })();

  return _instance;
})();