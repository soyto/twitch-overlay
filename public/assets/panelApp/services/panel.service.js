/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'panel.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $http = $hs.$instantiate('$http');

    //Retrieves twitch service initial data
    $this.get = function() {
      return $http.get('/v1/panel/');
    };

    $this.logout = function() {
      return $http.post('/v1/panel/logout');
    };

  }

})(angular);