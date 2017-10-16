/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoDashboardViewersBox';

  ng.module('panelApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $timeout = $hs.$instantiate('$timeout');

    function _controllerFn($sc, $element) {
    }

    //Link function
    function _linkFn($sc, $element, $attr) {

      var _data = {
        'value': null,
        'active': false,
      };

      $sc['data'] = _data;

      var _timeoutCb = null;

      $sc['$parent'].$watch($attr['data'], function($$newValue) {

        if(_data['value'] == null) {
          _data['value'] = $$newValue;
          return;
        }

        if(_data['value'] != $$newValue) {
          _data['value'] = $$newValue;
          _data['active'] = true;

          if(_timeoutCb != null) { $timeout.cancel(_timeoutCb); }

          _timeoutCb = $timeout(function(){
            _data['active'] = false;
          }, 1000);
        }

      });

    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {},
      'controller': ['$scope', '$element', _controllerFn],
      'templateUrl': '/assets/panelApp/templates/directives/layout/stoDashboardViewersBox.tpl.html'
    };
  }

})(angular);