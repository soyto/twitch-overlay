/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'socket.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $log = $hs.$instantiate('$log');
    var $rs = $hs.$instantiate('$rootScope');
    var $io = $hs.$instantiate('$io');
    var $window = $hs.$instantiate('$window');

    //Initialize socket
    $this.init = function() {
      var _socket = $io.connect('/panel');

      //On new follower
      _socket.on('twitch.lastFollower', function($$data) {
        $rs.$apply(function() {
          $rs.$broadcast('socket.twitch.lastFollower', $$data);
        });
      });

      _socket.on('twitch.channelInfo', function($$data) {
        $rs.$apply(function() {
          $rs.$broadcast('socket.twitch.channelInfo', $$data);
        });
      });

      _socket.on('twitch.streamStatus', function($$data) {
        $rs.$apply(function() {
          $rs.$broadcast('socket.twitch.streamStatus', $$data);
        });
      });
    };
  }

})(angular);