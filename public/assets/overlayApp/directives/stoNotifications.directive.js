/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoNotifications';
  var AUTO_CLOSE_NOTIFICATIONS = true;

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

      function _newNotification(notification) {

        _data['elements'].push(notification);

        if(AUTO_CLOSE_NOTIFICATIONS) {
          $timeout(function () {
            var _idx = _data['elements'].indexOf(notification);
            _data['elements'].splice(_idx, 1);
          }, 2000);
        }
      }


      /* -------------------------------------- EVENTS -------------------------------------- */

      //When we receive a notification
      $sc.$on('socket.notification', function($$event, $$notification) {
        $log.debug('notification recieved %o', $$notification);

        $sc['audio'].play('dixie-horn_daniel-simion');

        _newNotification($$notification);
      });

      //When we receive that we have a new follower
      $sc.$on('socket.twitch.follower.new', function($event, $$eventData) {

        $sc['audio'].play('sms-alert-4-daniel_simon');

        _newNotification({
          'type': 'twitch-new-follower',
          'data': $$eventData
        });
      });

      //When new follower on twitter
      $sc.$on('socket.twitter.follower.new', function($$event, $$eventData) {

        $sc['audio'].play('twitter');

        _newNotification({
          'type': 'twitter-new-follower',
          'data': $$eventData
        })
      });

      //When new mention on twitter
      $sc.$on('socket.twitter.mention.new', function($$event, $$eventData) {

        $sc['audio'].play('twitter');

        _newNotification({
          'type': 'twitter-new-mention',
          'data': $$eventData
        })
      });

      //When new mention on twitter
      $sc.$on('socket.twitter.retweet.new', function($$event, $$eventData) {

        $sc['audio'].play('twitter');

        _newNotification({
          'type': 'twitter-new-retweet',
          'data': $$eventData
        })
      });
    }

    //Link function
    function _linkFn($sc, $element, $attr) {

      $sc['audio'] = {};

      $sc['audio'].play = function(fileName) {
        var _file = $element.find('.audio-controls').find('#' + fileName).get(0);
        _file.pause();
        _file.play();
      };
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'controller': ['$scope', '$element', _controller],
      'templateUrl': '/assets/overlayApp/templates/directives/stoNotifications.tpl.html'
    };
  }

})(angular);