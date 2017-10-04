/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoNotifications';

  ng.module('overlayApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');

    function _controller($sc, $element) {

      var _data = {
        'elements': [{'title': 'HOLA', 'body': 'Mundo largo. etc...'}],
      };

      _init();

      /* -------------------------------------- SCOPE FUNCTIONS -------------------------------------- */


      /* -------------------------------------- PRIVATE FUNCTIONS -------------------------------------- */

      //Initialize
      function _init() {
        $sc['data'] = _data;

        $log.debug('scope %o', $sc);
      }


      /* -------------------------------------- EVENTS -------------------------------------- */

      //When we receive a notification
      $sc.$on('socket.notification', function($$event, $$notification) {
        $log.debug('notification recieved %o', $$notification);
        $sc.$apply(function() {
          _data['elements'].push($$notification);
        });
      });
    }


    //Link function
    function _linkFn($sc, $element, $attr) {
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'controller': ['$scope', '$element', _controller],
      'templateUrl': '/assets/overlayApp/templates/directives/stoNotifications.tpl.html'
    };
  }

})(angular);