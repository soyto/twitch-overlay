/* global */
(function (ng) {
  'use strict';

  var SERVICE_NAME = '$hs';
  var SERVICE_NAME_2 = 'helper.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$injector', _fn]);
  ng.module('panelApp').service(SERVICE_NAME_2, ['$injector', _fn]);

  function _fn($injector) {
    var $this = this;


    $this.notify = $injector.get('helper.service.notify').$setParent($this);


    //instantiates a angular element
    $this.$instantiate = function (elementName) {
      return $injector.get(elementName);
    };

  }

})(angular);