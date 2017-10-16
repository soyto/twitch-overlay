/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoDashboardOnlineTimeBox';

  ng.module('panelApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    function _controllerFn($sc, $element) {
    }

    //Link function
    function _linkFn($sc, $element, $attr) {

      var _data = {
        'value': null,
      };

      $sc['data'] = _data;

      $sc['$parent'].$watch($attr['data'], function($$newValue) {
        _data['value'] = $$newValue;
      });

    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {},
      'controller': ['$scope', '$element', _controllerFn],
      'templateUrl': '/assets/panelApp/templates/directives/dashboard/stoDashboardOnlineTimeBox.tpl.html'
    };
  }

})(angular);