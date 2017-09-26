/* global */
(function (ng) {
  'use strict';

  var CONTROLLER_NAME = 'root.controller';

  ng.module('panelApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $log = $hs.$instantiate('$log');
    var $rs = $hs.$instantiate('$rootScope');
    var $interval = $hs.$instantiate('$interval');
    var $windowService = $hs.$instantiate('window.service');


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
      }
    };

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

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

    /* ----------------------------------- PRIVATE FUNCTIONS ----------------------------------- */

    //Init function
    function _init() {
      $rs['_NAME'] = 'rootScope';
      $sc['_NAME'] = CONTROLLER_NAME;
      $rs['rootData'] = _rootData;
      $sc['data'] = _data;

      _rootData['title'] = 'Soyto\'s Twitch overlay panel';


      $windowService.get().then(function($$response) {
        if($$response['status'] != 200) { return; }

        _data['window']['width']['value'] = $$response['data']['width'];
        _data['window']['width']['$$value'] = $$response['data']['width'];
        _data['window']['height']['value'] = $$response['data']['height'];
        _data['window']['height']['$$value'] = $$response['data']['height'];
      });
    }


    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */
  }

})(angular);