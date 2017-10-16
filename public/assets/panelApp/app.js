/* global */
(function (ng) {
  'use strict';

  ng.module('panelApp', []);

  ng.module('panelApp')
    .constant('$moment', moment)
    .constant('$io', io);

})(angular);