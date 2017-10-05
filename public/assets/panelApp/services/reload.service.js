/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'reload.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $http = $hs.$instantiate('$http');


    $this.reload = function() {
      return $http.post('/v1/panel/reload');
    };

  }

})(angular);