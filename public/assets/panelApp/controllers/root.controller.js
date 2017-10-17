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
    var $windowService = $hs.$instantiate('window.service');
    var $twitchService = $hs.$instantiate('twitch.service');
    var $alertService = $hs.$instantiate('alert.service');
    var $twitterService = $hs.$instantiate('twitter.service');
    var $reloadService = $hs.$instantiate('reload.service');
    var $timeout = $hs.$instantiate('$timeout');
    var $socket = $hs.$instantiate('socket.service');


    var _rootData = {
      'title': ''
    };

    var _data = {
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
    };

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

    //Relaod overlay
    $sc.onClick_reload = function() {
      $reloadService.reload();
    };

    //When user wants to restore server values
    $sc.onClick_window_restoreDefaults = function() {
      _data['window']['width']['value'] =  _data['window']['width']['$$value'];
      _data['window']['height']['value'] =  _data['window']['height']['$$value'];
    };

    //On keydown on window width
    $sc.onKeydown_window_width = function($event) {
      if($event['keyCode'] == 27) {
        _data['window']['width']['value'] =  _data['window']['width']['$$value'];
      }
    };

    //On keydown window height
    $sc.onKeydown_window_height = function($event) {
      if($event['keyCode'] == 27) {
        _data['window']['height']['value'] =  _data['window']['height']['$$value'];
      }
    };

    //When user wants to save that data
    $sc.onClick_window_saveData = function() {

      _data['window']['width']['$$value'] =  _data['window']['width']['value'];
      _data['window']['height']['$$value'] =  _data['window']['height']['value'];

      $windowService.set(_data['window']['width']['value'], _data['window']['height']['value']);
    };

    //Alerts
    $sc.onClick_alertSend = function() {

      var _title = _data['alert']['title']['value'];
      var _body = _data['alert']['text']['value'];
      var _type = _data['alert']['type']['value'] ? 'sto-notification-blue' : null;

      if(_title.trim().length === 0) { return; }

      //Send notification
      $alertService.send(_title, _body, _type);

      _data['alert']['title']['value'] = '';
      _data['alert']['text']['value'] = '';
    };

    //Simulate new twitch user
    $sc.onClick_twitchNewFollower = function() {

      var _logins = ["dallas", 'usuario1', 'usuario2'];

      var _user = {
        "login": _logins[Math.floor(Math.random() * 3)],
        "display_name":"dallas",
        "description":"Just a gamer playing games and chatting. :)",
        "profile_image_url":"https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-profile_image-1a2c906ee2c35f12-300x300.png",
      }

      $twitchService.simulate.newFollower(_user);
    };

    $sc.onClick_twitterLogin = function() {
      $twitterService.getRequestUrl();
    };

    /* ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- */

    //Init function
    function _init() {
      $rs['_NAME'] = 'rootScope';
      $sc['_NAME'] = CONTROLLER_NAME;
      $rs['rootData'] = _rootData;
      $sc['data'] = _data;

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

          _data['window']['width']['value'] = $$response['data']['width'];
          _data['window']['width']['$$value'] = $$response['data']['width'];
          _data['window']['height']['value'] = $$response['data']['height'];
          _data['window']['height']['$$value'] = $$response['data']['height'];
        });
      });


      //Twitch data
      $$q = $$q.then(function() {
        return $twitchService.get().then(function($$response) {
          if($$response['status'] != 200) { return; }

          _data['twitch']['loginURI'] = $$response['data']['loginURI'];
          _data['twitch']['userData'] = $$response['data']['user'];
          _data['twitch']['channelInfo'] = $$response['data']['channelInfo'];
          _data['twitch']['stream'] = $$response['data']['stream'];
        });
      });

      return $$q;
    }


    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */

    $sc.$on('socket.twitch.streamStatus', function($event, $$data) {
      _data['twitch']['stream'] = $$data;
    });

    $sc.$on('socket.twitch.channelInfo', function($event, $$data) {
      _data['twitch']['channelInfo'] = $$data;
    });
  }

})(angular);