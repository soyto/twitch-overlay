/* global */
(function (ng) {
  'use strict';

  ng.module('panelApp', []);

  //Enable $log.debug
  ng.module('panelApp').config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(true);
  }]);

})(angular);