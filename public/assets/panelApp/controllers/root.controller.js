/* global */
(function (ng) {
  'use strict';

  var CONTROLLER_NAME = 'root.controller';

  ng.module('panelApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $log = $hs.$instantiate('$log');
    var $q = $hs.$instantiate('$q');
    var $rs = $hs.$instantiate('$rootScope');
    var $interval = $hs.$instantiate('$interval');
    var $http = $hs.$instantiate('$http');
    var $windowService = $hs.$instantiate('window.service');
    var $twitchService = $hs.$instantiate('twitch.service');
    var $alertService = $hs.$instantiate('alert.service');
    var $twitterService = $hs.$instantiate('twitter.service');
    var $timeout = $hs.$instantiate('$timeout');
    var $socket = $hs.$instantiate('socket.service');


    var _rootData = {
      'title': '',
      'window': {
        'width':{
          'value': -1,
          '$$value': -1,
          'pristine': false
        },
        'height': {
          'value': -1,
          '$$value': -1,
          'pristine': false
        }
      },
      'twitch': {
        'loginURI': null,
        'userData': null,
        'stream': null,
        'channelInfo': null,
      },
      'alert': {
        'title': {
          'value': null
        },
        'text': {
          'value': null
        },
        'type': {
          'value': false
        }
      },
      '$$state': {
        'controlSidebar': {
          'tab': 'control-sidebar-settings-tab'
        }
      }
    };

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

    //
    // CONTROL_SIDEBAR
    // ----------

    //On click to change tab
    $sc.onClick_controlSidebar_setTab = function(tabName) {
      _rootData['$$state']['controlSidebar']['tab'] = tabName;
    };
    
    
    //When user wants to restore server values
    $sc.onClick_window_restoreDefaults = function() {
      _rootData['window']['width']['value'] =  _rootData['window']['width']['$$value'];
      _rootData['window']['height']['value'] =  _rootData['window']['height']['$$value'];
    };

    //On keydown on window width
    $sc.onKeydown_window_width = function($event) {
      if($event['keyCode'] == 27) {
        _rootData['window']['width']['value'] =  _rootData['window']['width']['$$value'];
      }
    };

    //On keydown window height
    $sc.onKeydown_window_height = function($event) {
      if($event['keyCode'] == 27) {
        _rootData['window']['height']['value'] =  _rootData['window']['height']['$$value'];
      }
    };

    //When user wants to save that data
    $sc.onClick_window_saveData = function() {

      _rootData['window']['width']['$$value'] =  _rootData['window']['width']['value'];
      _rootData['window']['height']['$$value'] =  _rootData['window']['height']['value'];

      $windowService.set(_rootData['window']['width']['value'], _rootData['window']['height']['value']);
    };

    //Alerts
    $sc.onClick_alertSend = function() {

      var _title = _rootData['alert']['title']['value'];
      var _body = _rootData['alert']['text']['value'];
      var _type = _rootData['alert']['type']['value'] ? 'sto-notification-blue' : null;

      if(_title.trim().length === 0) { return; }

      //Send notification
      $alertService.send(_title, _body, _type);

      _rootData['alert']['title']['value'] = '';
      _rootData['alert']['text']['value'] = '';
    };



    //
    // SIMULATION
    // ----------------------

    //Simulate new twitch user
    $sc.onClick_twitchNewFollower = function() {

      var _logins = ["dallas", 'usuario1', 'usuario2'];

      var _user = {
        "login": _logins[Math.floor(Math.random() * 3)],
        "display_name":"dallas",
        "description":"Just a gamer playing games and chatting. :)",
        "profile_image_url":"https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-profile_image-1a2c906ee2c35f12-300x300.png",
      };

      $twitchService.simulate.newFollower(_user);
    };

    $sc.onClick_twitterNewFollower = function() {
      $twitterService.simulate.newFollower();
    };

    $sc.onClick_twitterNewMention = function() {
      $twitterService.simulate.newMention();
    };

    $sc.onClick_twitterNewRetweet = function() {
      $twitterService.simulate.newRetweet();
    };

    /* ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- */

    //Init function
    function _init() {
      $rs['_NAME'] = 'rootScope';
      $sc['_NAME'] = CONTROLLER_NAME;
      $rs['rootData'] = _rootData;
      $sc['data'] = _rootData;

      _rootData['title'] = 'Soyto\'s Twitch overlay panel';

      _loadInitialData().then(function(){
        $socket.init();
      });
    }

    //Loads initial data
    function _loadInitialData() {
      var $$q = $q.resolve();

      //Window data
      $$q = $$q.then(function() {
        return $windowService.get().then(function($$response) {
          if($$response['status'] != 200) { return; }

          _rootData['window']['width']['value'] = $$response['data']['width'];
          _rootData['window']['width']['$$value'] = $$response['data']['width'];
          _rootData['window']['height']['value'] = $$response['data']['height'];
          _rootData['window']['height']['$$value'] = $$response['data']['height'];
        });
      });

      //Twitch data
      $$q = $$q.then(function() {
        return $twitchService.get().then(function($$response) {
          if($$response['status'] != 200) { return; }

          _rootData['twitch']['loginURI'] = $$response['data']['loginURI'];
          _rootData['twitch']['userData'] = $$response['data']['user'];
          _rootData['twitch']['channelInfo'] = $$response['data']['channelInfo'];
          _rootData['twitch']['stream'] = $$response['data']['stream'];
        });
      });

      return $$q;
    }


    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */

    $sc.$on('socket.twitch.streamStatus', function($event, $$data) {
      _rootData['twitch']['stream'] = $$data;
    });

    $sc.$on('socket.twitch.channelInfo', function($event, $$data) {
      _rootData['twitch']['channelInfo'] = $$data;
    });
  }

})(angular);