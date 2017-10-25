(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'panelApp.dashboard.controller';

  ng.module('panelApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $log = $hs.$instantiate('$log');
    var $rs = $hs.$instantiate('$rootScope');
    var $reloadService = $hs.$instantiate('reload.service');

    var _rootData = $rs['rootData'];
    var _data = {};

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

    //Reload overlay
    $sc.onClick_reload = function() {
      $reloadService.reload();
    };

    /* ----------------------------------- PRIVATE FUNCTIONS ------------------------------------- */

    function _init() {
      $sc['_NAME'] = CONTROLLER_NAME;
      $sc['data'] = _data;

      _rootData['title'] = 'Soyto\'s Twitch overlay panel';
      _loadInitialData();
    }

    //Loads controller initialData
    function _loadInitialData() {

    }

    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */

  }

})(angular);