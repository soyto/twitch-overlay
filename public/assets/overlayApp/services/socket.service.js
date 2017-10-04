/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'socket.service';

  ng.module('overlayApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $log = $hs.$instantiate('$log');
    var $rs = $hs.$instantiate('$rootScope');
    var $io = $hs.$instantiate('$io');
    var $window = $hs.$instantiate('$window');

    //Initialize socket
    $this.init = function() {
      var _socket = $io.connect('http://localhost/overlay');

      _socket.on('notification', function($$data) {
        $rs.$broadcast('socket.notification', $$data);
      });

      _socket.on('reload', function() {
        $log.debug('reloading...');
        $window.location.reload();
      });

      _socket.on('window', function($$data) {
        $rs.$apply(function() {
          $rs.$broadcast('socket.window', $$data);
        });
      });
    };
  }

})(angular);