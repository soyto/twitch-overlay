/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;
  var $twitchService = require('./twitch.service');


  //Gets twitch service
  $this.getTwitchService = function() {
    return $twitchService;
  };

})();