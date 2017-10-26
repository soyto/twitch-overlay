/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'ngFocusOn';

  ng.module('panelApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {

    //Link function
    function _linkFn($sc, $element, $attr) {
      $sc.$on('ngFocusOn', function($$event, $$eventData) {

        if($$eventData == $sc.$eval($attr[DIRECTIVE_NAME])) {
          $element.get(0).focus();
        }
      });
    }

    return {
      'restrict': 'A',
      'link': _linkFn
    };
  }

})(angular);