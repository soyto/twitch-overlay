/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'overlay.service';

  ng.module('overlayApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $http = $hs.$instantiate('$http');
    var $log = $hs.$instantiate('$log');
    var $rs = $hs.$instantiate('$rootScope');
    var $location = $hs.$instantiate('$location');

    //Retrieve init configuration
    $this.init = function() {
      $http.get('/v1/overlay').then(function ($$response) {

        if($$response['status'] != 200) {
          // $location.reload();
          return;
        }

        var _data = $$response['data'];

        //Broaddcast window data
        $rs.$broadcast('socket.window', _data['window']);
        $rs.$broadcast('twitch.lastFollower', _data['twitch']['last_follower']);
      });
    };
  }

})(angular);