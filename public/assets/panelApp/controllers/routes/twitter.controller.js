(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'panelApp.twitter.controller';

  ng.module('panelApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $log = $hs.$instantiate('$log');
    var $q = $hs.$instantiate('$q');
    var $rs = $hs.$instantiate('$rootScope');
    var $uibModal = $hs.$instantiate('$uibModal');
    var $twitterService = $hs.$instantiate('twitter.service');

    var _rootData = $rs['rootData'];
    var _data = {
      'userAccount': null,
      '$$state': {
        'loading': true
      }
    };

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

    //Twitter login
    $sc.onClick_twitterLogin = function() {
      $twitterService.getRequestUrl();
    };

    //When user attempts to schdule
    $sc.onClick_schedule = function() {
      var _instance = $uibModal.open({
        'backdrop': 'static',
        'controller': 'panelApp.twitter.schedule.modal.controller',
        'templateUrl': '/assets/panelApp/templates/modals/twitter/schedule.modal.tpl.html'
      });

      _instance['result'].then(function(){
        console.log('called when closed');
      }).catch(function() {
        console.log('called when canceled');
      });
    };

    /* ----------------------------------- PRIVATE FUNCTIONS ------------------------------------- */

    function _init() {
      $sc['_NAME'] = CONTROLLER_NAME;
      $sc['data'] = _data;

      _rootData['title'] = 'Soyto\'s Twitch overlay panel | Twitter';
      _loadInitialData().then(function(){
        //console.log(_data);
        _data['$$state']['loading'] = false;
      });
    }

    //Loads controller initialData
    function _loadInitialData() {
      var $$q = $q.resolve();

      $$q = $$q.then(function() {
        return $twitterService.get().then(function($$response) {
          if($$response['status'] != 200) {}

          _data['userAccount'] = $$response['data'];
        });
      });


      return $$q;
    }

    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */
  }

})(angular);