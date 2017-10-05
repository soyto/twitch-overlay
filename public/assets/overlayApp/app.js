/* global io:false */
(function (ng) {
  'use strict';

  ng.module('overlayApp', [
    'ngAnimate'
  ]);


  ng.module('overlayApp')
      .constant('$io', io);

})(angular);