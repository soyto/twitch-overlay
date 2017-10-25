/* global */
(function(ng) {
  'use strict';

  ng.module('panelApp').config(['$routeProvider', _fn]);

  function _fn($rp) {


    $rp.when('/', {
      'controller': 'panelApp.dashboard.controller',
      'templateUrl': '/assets/panelApp/templates/routes/dashboard.tpl.html',
    });

    $rp.when('/twitter', {
      'controller': 'panelApp.twitter.controller',
      'templateUrl': '/assets/panelApp/templates/routes/twitter.tpl.html',
    });
  }

})(angular);