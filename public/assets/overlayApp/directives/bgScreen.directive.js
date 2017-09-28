/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'bgScreen';

  ng.module('overlayApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    function _linkFn($sc, $element, $attr) {
      $sc.$on('socket.window', function($$event, $$data) {
        $element.css('height', $$data['height'] + 'px');
        $element.css('width', $$data['width'] + 'px');
      });
    }

    return {
      'restrict': 'A',
      'link': _linkFn
    };
  }

})(angular);