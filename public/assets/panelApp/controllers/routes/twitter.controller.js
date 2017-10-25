(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'panelApp.twitter.controller';

  ng.module('panelApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $log = $hs.$instantiate('$log');
    var $rs = $hs.$instantiate('$rootScope');
    var $twitterService = $hs.$instantiate('twitter.service');

    var _rootData = $rs['rootData'];
    var _data = {};

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

    //Twitter login
    $sc.onClick_twitterLogin = function() {
      $twitterService.getRequestUrl();
    };

    /* ----------------------------------- PRIVATE FUNCTIONS ------------------------------------- */

    function _init() {
      $sc['_NAME'] = CONTROLLER_NAME;
      $sc['data'] = _data;

      _rootData['title'] = 'Soyto\'s Twitch overlay panel | Twitter';
      _loadInitialData();
    }

    //Loads controller initialData
    function _loadInitialData() {

    }

    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */
  }

})(angular);