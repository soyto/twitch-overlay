/* global */
(function (ng) {
  'use strict';

  var CONTROLLER_NAME = 'root.controller';

  ng.module('overlayApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $log = $hs.$instantiate('$log');
    var $rs = $hs.$instantiate('$rootScope');
    var $interval = $hs.$instantiate('$interval');
    var $http = $hs.$instantiate('$http');
    var $overlayService = $hs.$instantiate('overlay.service');
    var $socketService = $hs.$instantiate('socket.service');
    var $location = $hs.$instantiate('$location');

    var _rootData = {
      'title': '',
      '$$state': {
        'scaled': false
      }
    };

    var _data = {

    };

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

    /* ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- */

    //Init function
    function _init() {
      $rs['_NAME'] = 'rootScope';
      $sc['_NAME'] = CONTROLLER_NAME;
      $rs['rootData'] = _rootData;
      $sc['data'] = _data;

      _rootData['title'] = 'Soyto\'s Twitch overlay';

      $overlayService.init();
      $socketService.init();

      if($location.hash() == 'scaled') {
        _rootData['$$state']['scaled'] = true;
      }

    }

    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */
  }

})(angular);