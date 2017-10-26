/* global */
(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'panelApp.twitter.schedule.modal.controller';

  ng.module('panelApp').controller(CONTROLLER_NAME, ['$scope', '$hs', '$uibModalInstance', _fn]);

  function _fn($sc, $hs, $uibModalInstance) {

    var $log = $hs.$instantiate('$log');
    var $q = $hs.$instantiate('$q');

    var $twitterService = $hs.$instantiate('twitter.service');

    var _data = {

      'hours': {
        'value': 0,
        'has_error': false,
        'error': null,
        'pristine': true,
      },

      'minutes': {
        'value': 0,
        'has_error': false,
        'error': null,
        'pristine': true,
      },

      'seconds': {
        'value': 0,
        'has_error': false,
        'error': null,
        'pristine': true,
      },

      'tweetText': {
        'value': '',
        'has_error': false,
        'error': null,
        'pristine': true,
      },

    };

    _init();

    /* ----------------------------------- SCOPE FUNCTIONS ------------------------------------- */

    //On change hours
    $sc.onChange_hours = function() {
      _validate_hours();
    };

    //On change minutes
    $sc.onChange_minutes = function() {
      _validate_minutes();
    };

    //On change seconds
    $sc.onChange_seconds = function() {
      _validate_seconds();
    };

    //On change tweet text
    $sc.onChange_tweetText = function() {
      _validate_tweetText();
    };

    //When user attempts to close the modal
    $sc.onClick_close = function() {
      _close();
    };

    $sc.onClick_save = function() {


      //Not valid, dont do nothing
      if(!_validate()) { return; }

    };


    /* ----------------------------------- PRIVATE FUNCTIONS ------------------------------------- */

    //Init function
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

    //Close fn
    function _close() {
      $uibModalInstance.dismiss('user cancelled');
    }

    //Validation function
    function _validate() {

      var _hours = _data['hours'];
      var _minutes = _data['minutes'];
      var _seconds = _data['seconds'];
      var _tweetText = _data['tweetText'];

      _hours['pristine'] = false;
      _minutes['pristine'] = false;
      _seconds['pristine'] = false;
      _tweetText['pristine'] = false;

      var _$$hours = _validate_hours();
      var _$$minutes = _validate_minutes();
      var _$$seconds = _validate_seconds();
      var _$$tweetText = _validate_tweetText();

      if(!_$$hours) { $sc.$broadcast('ngFocusOn', CONTROLLER_NAME + '.hours'); }
      else if(!_$$minutes) { $sc.$broadcast('ngFocusOn', CONTROLLER_NAME + '.minutes'); }
      else if(!_$$seconds) { $sc.$broadcast('ngFocusOn', CONTROLLER_NAME + '.seconds'); }
      else if(!_$$tweetText) { $sc.$broadcast('ngFocusOn', CONTROLLER_NAME + '.tweetText'); }

      return _$$hours &&
          _$$minutes &&
          _$$seconds &&
          _$$tweetText;
    }

    //Validate hours
    function _validate_hours(){
      var _element = _data['hours'];

      _element['has_error'] = false;
      _element['error'] = null;

      //Element is on pristine? dont do nothing
      if(_element['pristine']) { return true; }

      if(_element['value'] == null ) {
        _element['has_error'] = true;
        _element['error'] = 'Introduce un valor';
      }
      else if(_element['value'].toString().length === 0) {
        _element['has_error'] = true;
        _element['error'] = 'Introduce un valor';
      }
      else if(isNaN(_element['value'])) {
        _element['has_error'] = true;
        _element['error'] = 'No es un número válido';
      }
      else if(parseInt(_element['value']) < 0) {
        _element['has_error'] = true;
        _element['error'] = 'Debe ser un valor positivo';
      }

      return !_element['has_error'];
    }

    //Validate minutes
    function _validate_minutes(){
      var _element = _data['minutes'];

      _element['has_error'] = false;
      _element['error'] = null;

      //Element is on pristine? dont do nothing
      if(_element['pristine']) { return true; }

      if(_element['value'] == null ) {
        _element['has_error'] = true;
        _element['error'] = 'Introduce un valor';
      }
      else if(_element['value'].toString().length === 0) {
        _element['has_error'] = true;
        _element['error'] = 'Introduce un valor';
      }
      else if(isNaN(_element['value'])) {
        _element['has_error'] = true;
        _element['error'] = 'No es un número válido';
      }
      else if(parseInt(_element['value']) < 0) {
        _element['has_error'] = true;
        _element['error'] = 'Debe ser un valor positivo';
      }
      else if(parseInt(_element['value']) > 59) {
        _element['has_error'] = true;
        _element['error'] = 'Debe ser un número comprendiedo entre 0 y 59';
      }

      return !_element['has_error'];
    }

    //Validate seconds
    function _validate_seconds(){
      var _element = _data['seconds'];

      _element['has_error'] = false;
      _element['error'] = null;

      //Element is on pristine? dont do nothing
      if(_element['pristine']) { return true; }

      if(_element['value'] == null ) {
        _element['has_error'] = true;
        _element['error'] = 'Introduce un valor';
      }
      else if(_element['value'].toString().length === 0) {
        _element['has_error'] = true;
        _element['error'] = 'Introduce un valor';
      }
      else if(isNaN(_element['value'])) {
        _element['has_error'] = true;
        _element['error'] = 'No es un número válido';
      }
      else if(parseInt(_element['value']) < 0) {
        _element['has_error'] = true;
        _element['error'] = 'Debe ser un valor positivo';
      }
      else if(parseInt(_element['value']) > 59) {
        _element['has_error'] = true;
        _element['error'] = 'Debe ser un número comprendiedo entre 0 y 59';
      }

      return !_element['has_error'];
    }

    //Validate tweetText
    function _validate_tweetText(){
      var _element = _data['tweetText'];

      _element['has_error'] = false;
      _element['error'] = null;

      //Element is on pristine? dont do nothing
      if(_element['pristine']) { return true; }

      if(_element['value'] && _element['value'].length > 250) {
        _element['has_error'] = true;
        _element['error'] = 'No puedes introducir un valor superior a 255 carácteres';
      }

      return !_element['has_error'];
    }

    /* ----------------------------------- EVENTS HANDLERS ------------------------------------- */
  }

})(angular);