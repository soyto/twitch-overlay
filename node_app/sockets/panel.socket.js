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
      _io = server.of('/panel');
      _io.on('connection', _onConnection);
    };

    //Returns the number of connected clients
    $this.getNumberOfConnectedClients = function() {
      return _sockets.length;
    };

    //Push new follower
    $this.pushTwitchLastFollower = function(followerData) {
      _io.emit('twitch.lastFollower', followerData);
    };


    //Pushes channel info
    $this.pushTwitchChannelInfo = function(channelInfo) {
      _io.emit('twitch.channelInfo', channelInfo);
    };

    //Pushes stream status
    $this.pushTwitchStreamStatus = function(streamData) {
      _io.emit('twitch.streamStatus', streamData);
    };

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