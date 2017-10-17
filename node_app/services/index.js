/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;
  var $twitchService = require('./twitch.service');

  $this['twitch'] = require('./twitch.service');
  $this['twitter'] = require('./twitter.service');


  //Gets twitch service
  $this.getTwitchService = function() {
    return $twitchService;
  };

})();