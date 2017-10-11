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

      function _newNotification(title, body, type) {

        var _notification = {
          'title': title,
          'body': body,
          'type': type
        };

        _data['elements'].push(_notification);

        //HACK to activate animations on notification body
        $timeout(function() {
          _notification['isActive'] = true;
        });

        $timeout(function() {
          var _idx = _data['elements'].indexOf(_notification);
          _data['elements'].splice(_idx, 1);
        }, 2000);
      }


      /* -------------------------------------- EVENTS -------------------------------------- */

      $sc.$on('socket.twitch.follower.new', function($event, $$eventData) {
        $log.debug('new twitch follower %o', $$eventData);
        var _title = '@' + $$eventData['display_name'] + ' te sigue ahora';
        var _body = $$eventData['description'].length === 0 ? null : $$eventData['description'];
        _newNotification(_title, _body, 'sto-twitch-new-follower');
      });

      //When we receive a notification
      $sc.$on('socket.notification', function($$event, $$notification) {
        $log.debug('notification recieved %o', $$notification);
        _newNotification($$notification['title'], $$notification['body'], $$notification['type']);
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