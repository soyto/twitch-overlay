/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoLastFollower';

  ng.module('overlayApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $timeout = $hs.$instantiate('$timeout');

    //Link function
    function _linkFn($sc, $element, $attr) {

      var _animationTimeout = null;

      $sc.$on('socket.twitch.follower.new', function($event, userData) {

        $sc['lastUser'] = userData;
        $sc['startAnimation'] = true;

        if(_animationTimeout != null) {
          $timeout.cancel(_animationTimeout);
        }

        _animationTimeout = $timeout(function() {
          $sc['startAnimation'] = false;
          _animationTimeout = null;
        }, 4000);
      });

      $sc.$on('twitch.lastFollower', function($event, lastUserData){
        $sc['lastUser'] = lastUserData;
      });
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {},
      'templateUrl': '/assets/overlayApp/templates/directives/stoLastFollower.tpl.html'
    };
  }

})(angular);