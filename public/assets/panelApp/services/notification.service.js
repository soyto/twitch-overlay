/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'alert.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $http = $hs.$instantiate('$http');

    //Sets window info
    $this.send = function(title, text, type) {
      return $http.post('/v1/panel/notification', {
        'title': title,
        'body': text,
        'type': type
      });
    };

  }

})(angular);