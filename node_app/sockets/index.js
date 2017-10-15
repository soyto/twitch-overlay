/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  $this['panel'] = require('./panel.socket');
  $this['overlay'] = require('./overlay.socket');

  //Starts server
  $this.start = function(server) {
    var _ioSocketServer = require('socket.io')(server);
    $this['panel'].init(_ioSocketServer);
    $this['overlay'].init(_ioSocketServer);
  };

})();