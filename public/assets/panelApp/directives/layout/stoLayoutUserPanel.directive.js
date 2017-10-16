/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoLayoutUserPanel';

  ng.module('panelApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $timeout = $hs.$instantiate('$timeout');
    var $panelService = $hs.$instantiate('panel.service');
    var $window = $hs.$instantiate('$window');

    function _controllerFn($sc, $element) {
      //Log out
      $sc.onClick_logOut = function() {
        $panelService.logout().then(function(){
          $window.location.reload();
        });
      };
    }

    //Link function
    function _linkFn($sc, $element, $attr) {}

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {
        'twitch': '=data'
      },
      'controller': ['$scope', '$element', _controllerFn],
      'templateUrl': '/assets/panelApp/templates/directives/layout/stoLayoutUserPanel.tpl.html'
    };
  }

})(angular);