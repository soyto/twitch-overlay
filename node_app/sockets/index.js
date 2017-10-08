/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;

  var $overlaySocket = require('./overlay.socket');

  //Return overlay socket
  $this.getOverlaySocket = function() {
    return $overlaySocket;
  };

  $this.start = function(server) {
    $overlaySocket.init(server);
  };

})();