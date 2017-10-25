/* global */
(function (ng) {
  'use strict';

  ng.module('panelApp', [
    'ngRoute'
  ]);

  ng.module('panelApp')
    .constant('$moment', moment)
    .constant('$io', io);

})(angular);