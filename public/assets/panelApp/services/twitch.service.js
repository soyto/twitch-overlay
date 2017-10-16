/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'twitch.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $http = $hs.$instantiate('$http');

    //Retrieves twitch service initial data
    $this.get = function() {
      return $http.get('/v1/panel/twitch');
    };




    $this.simulate = new (function() {
      var $$this = this;

      $$this.newFollower = function(followerData) {
        return $http({
          'url': '/v1/panel/twitch/simulate/newFollower',
          'method': 'POST',
          'data': followerData
        });
      };

    })();

  }

})(angular);