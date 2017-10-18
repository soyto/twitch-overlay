/* global */
(function(ng) {
  'use strict';

  var FILTER_NAME = 'trust';

  ng.module('panelApp').filter(FILTER_NAME, ['$hs', _fn]);

  function _fn($hs) {

    var $sce = $hs.$instantiate('$sce');

    return function(value) {
      console.log(value);
      return $sce.trustAsResourceUrl(value);
    }
  }

})(angular);