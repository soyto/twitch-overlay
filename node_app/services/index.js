/* global */
module.exports = new (function() {
  'use strict';
  var $this = this;
  var $twitchService = require('./twitch.service');

  $this['twitch'] = require('./twitch.service');
  $this['twitch.watcher'] = require('./twitch.watcher.service');
  $this['twitter'] = require('./twitter.service');
  $this['twitter.watcher'] = require('./twitter.watcher.service');

})();