/* global */
(function(ng) {
  'use strict';

  var SERVICE_NAME = 'twitter.service';

  ng.module('panelApp').service(SERVICE_NAME, ['$hs', _fn]);

  function _fn($hs) {
    var $this = this;

    var $window = $hs.$instantiate('$window');
    var $http = $hs.$instantiate('$http');

    //Retrieves twitter token
    $this.getRequestUrl = function() {
      return $http.get('/v1/panel/twitter/token').then(function($$responseData) {
        $window.location.href = $$responseData['data']['uri'];
      });
    };


    $this.simulate = new (function() {
      var $$this = this;

      $$this.newFollower = function() {
        return $http.post('/v1/panel/twitter/simulate/newFollower');
      };

      $$this.newMention = function() {
        return $http.post('/v1/panel/twitter/simulate/newMention');
      };

      $$this.newRetweet = function() {
        console.log('new retweet');
        return $http.post('/v1/panel/twitter/simulate/newRetweet');
      };
    })();

  }

})(angular);