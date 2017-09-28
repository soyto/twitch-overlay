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
      _io = require('socket.io')(server).of('/overlay');

      _io.on('connection', _onConnection);
    };

    //Returns the number of connected clients
    $this.getNumberOfConnectedClients = function() {
      return _sockets.length;
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
    $this.sendAlert = function(data) {
      _io.emit('alert', data);
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