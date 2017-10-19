/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoDashboardFollowersBox';

  ng.module('panelApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $timeout = $hs.$instantiate('$timeout');
    var $twitchService = $hs.$instantiate('twitch.service');

    function _controllerFn($sc, $element) {
    }

    //Link function
    function _linkFn($sc, $element, $attr) {

      var _data = {
        'value': null,
        'active': false,
        'lastFollower': null,
      };

      $sc['data'] = _data;

      var _timeoutCb = null;

      $sc['$parent'].$watch($attr['data'], function($$newValue) {

        //First iteration...
        if(_data['value'] == null) {

          _data['value'] = $$newValue;

          return $twitchService.getLastFollower().then(function($$response) {
            if($$response['status'] != 200) { return; }
            _data['lastFollower'] = $$response['data'];
          });
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
      'templateUrl': '/assets/panelApp/templates/directives/dashboard/stoDashboardFollowersBox.tpl.html'
    };
  }

})(angular);