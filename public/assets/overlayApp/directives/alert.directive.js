/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'stoAlert';

  ng.module('overlayApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $timeout = $hs.$instantiate('$timeout');

    function _linkFn($sc, $element, $attr) {

      $sc.$on('socket.alert', function($$event, $$data) {
        var _title = $$data['title'];
        var _text = $$data['text'];

        var _div = jQuery('<div>')
            .addClass('alert alert-warning sto_alert')
            .attr('role', 'alert');

        _div.append('<strong>' + _title + '</strong> ' + _text);

        $element.append(_div);

        $timeout(function() {
          _div.remove();
        }, 1500);

      });
    }

    return {
      'restrict': 'E',
      'link': _linkFn
    };
  }

})(angular);

/*
 <div class="alert alert-warning alert-dismissible" role="alert">
 <strong>Warning!</strong> Better check yourself, you're not looking too good.
 </div>
 */