/* global moment:false, io:false */
(function (ng) {
  'use strict';

  ng.module('panelApp', [
    'ngRoute',
    'ui.bootstrap'
  ]);

  ng.module('panelApp')
    .constant('$moment', moment)
    .constant('$io', io);

})(angular);