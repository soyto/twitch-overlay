/* global */
(function (ng) {
  'use strict';

  var CONTROLLER_NAME = 'root.controller';

  ng.module('overlayApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $rs = $hs.$instantiate('$rootScope');
    var $interval = $hs.$instantiate('$interval');
    var $http = $hs.$instantiate('$http');

    var _rootData = {
      'title': '',
      'screen': {
        'width': null,
        'height': null
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

      $http.get('/v1/panel/window').then(function ($$response) {
        _rootData['screen']['width'] = $$response['data']['width'];
        _rootData['screen']['height'] = $$response['data']['height'];
      });
    }


    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */
  }

})(angular);