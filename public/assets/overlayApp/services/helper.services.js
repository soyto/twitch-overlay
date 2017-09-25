/* global */
(function (ng) {
  'use strict';

  var SERVICE_NAME = '$hs';
  var SERVICE_NAME_2 = 'helper.service';

  ng.module('overlayApp').service(SERVICE_NAME, ['$injector', _fn]);
  ng.module('overlayApp').service(SERVICE_NAME_2, ['$injector', _fn]);

  function _fn($injector) {
    var $this = this;


    //instantiates a angular element
    $this.$instantiate = function (elementName) {
      return $injector.get(elementName);
    };

  }

})(angular);