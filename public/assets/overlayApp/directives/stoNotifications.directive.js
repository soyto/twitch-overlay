/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoNotifications';

  ng.module('overlayApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $timeout = $hs.$instantiate('$timeout');

    function _controller($sc, $element) {

      var _data = {
        'elements': [],
      };

      _init();

      /* -------------------------------------- SCOPE FUNCTIONS -------------------------------------- */


      /* -------------------------------------- PRIVATE FUNCTIONS -------------------------------------- */

      //Initialize
      function _init() {
        $sc['data'] = _data;
      }


      /* -------------------------------------- EVENTS -------------------------------------- */

      //When we receive a notification
      $sc.$on('socket.notification', function($$event, $$notification) {
        $log.debug('notification recieved %o', $$notification);
        _data['elements'].push($$notification);

        //HACK to activate animations on notification body
        $timeout(function() {
          $$notification['isActive'] = true;
        });

        /*$timeout(function() {
          var _idx = _data['elements'].indexOf($$notification);
          _data['elements'].splice(_idx, 1);
        }, 2000);*/
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