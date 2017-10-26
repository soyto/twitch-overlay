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


    $this.simulate = new (function() {
      var $$this = this;

      $$this.newFollower = function() {
        return $http.post(BASE_URL + '/newFollower');
      };

      $$this.newMention = function() {
        return $http.post(BASE_URL + '/newMention');
      };

      $$this.newRetweet = function() {
        return $http.post(BASE_URL + '/newRetweet');
      };
    })();

  }

})(angular);