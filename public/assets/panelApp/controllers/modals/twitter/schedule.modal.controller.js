/* global */
(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'panelApp.twitter.schedule.modal.controller';

  ng.module('panelApp').controller(CONTROLLER_NAME, ['$scope', '$hs', '$uibModalInstance', _fn]);

  function _fn($sc, $hs, $uibModalInstance) {

    var $log = $hs.$instantiate('$log');
    var $q = $hs.$instantiate('$q');

    var $twitterService = $hs.$instantiate('twitter.service');

    var _data = {};

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */


    /* ----------------------------------- PRIVATE FUNCTIONS ------------------------------------- */

    function _init() {
      $sc['_NAME'] = CONTROLLER_NAME;
      $sc['data'] = _data;
      _loadInitialData().then(function(){
      });
    }

    //Loads controller initialData
    function _loadInitialData() {
      return $q.resolve();
    }

    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */
  }

})(angular);