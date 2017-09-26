/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'window.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $http = $hs.$instantiate('$http');

    //Gets window info
    $this.get = function() {
      return $http.get('/v1/panel/window');
    };

    //Sets window info
    $this.set = function(width, height) {
      return $http.post('/v1/panel/window', {
        'width': width,
        'height': height
      });
    };

  }

})(angular);