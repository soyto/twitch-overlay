/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'twitter.service';
  var BASE_URL = '/v1/panel/twitter';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $window = $hs.$instantiate('$window');
    var $http = $hs.$instantiate('$http');

    //Get twitter info
    $this.get = function() {
      return $http.get(BASE_URL + '/');
    };

    //Retrieves twitter token
    $this.getRequestUrl = function() {
      return $http.get(BASE_URL + '/token').then(function($$responseData) {
        $window.location.href = $$responseData['data']['uri'];
      });
    };

    $this.schedule = new (function() {
      var $$this = this;


      $$this.getAll = function() {
        return $http.get(BASE_URL + '/schedule');
      };

      //Adds a new scheduled tweet
      $$this.add = function(hours, minutes, seconds, text) {
        return $http.post(BASE_URL + '/schedule', {
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds,
          'text': text
        });
      };

      $$this.remove = function($$id) {

      };

    })();

    //Simulate some tweets
    $this.simulate = new (function() {
      var $$this = this;

      $$this.newFollower = function() {
        return $http.post(BASE_URL + '/simulate/newFollower');
      };

      $$this.newMention = function() {
        return $http.post(BASE_URL + '/simulate/newMention');
      };

      $$this.newRetweet = function() {
        return $http.post(BASE_URL + '/simulate/newRetweet');
      };
    })();

  }

})(angular);