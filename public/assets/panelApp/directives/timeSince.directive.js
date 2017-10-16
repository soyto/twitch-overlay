/* global */
(function(ng) {
  'use strict';

  var DIRECTIVE_NAME = 'timeSince';

  ng.module('panelApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $timeout = $hs.$instantiate('$timeout');
    var $panelService = $hs.$instantiate('panel.service');
    var $interval = $hs.$instantiate('$interval');
    var $moment = $hs.$instantiate('$moment');


    //Link function
    function _linkFn($sc, $element, $attr) {

      $interval(function(){
        var _date = $moment($sc['date']);
        var _now = $moment();

        var _diff = _now.diff(_date) / 1000;
        var _seconds = Math.floor(_diff % 60);
        _diff = _diff / 60;
        var _minutes = Math.floor(_diff % 60);
        var _hours = Math.floor(_diff / 60);

        var _locale = {'minimumIntegerDigits': 2};
        $element.text(_hours.toLocaleString('en-US', _locale) + ':'
          + _minutes.toLocaleString('en-US', _locale) + ':'
          + _seconds.toLocaleString('en-US', _locale));
      }, 1000);

    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {
        'date': '='
      },
    };
  }

})(angular);