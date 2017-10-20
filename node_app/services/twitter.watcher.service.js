module.exports = new (function() {
  'use strict';
  var $this = this;

  var $log = require('../lib/log');
  var $twitterService = require('./twitter.service');
  var $overlaySocket = require('../sockets')['overlay'];

  var _data = {
    'user': null,
    'followers': null,
    'mentions': null,
    'iteration': {
      'count': 0,
      'fns': [
        _iteration_alertNewFollower,
        _iteration_alertMention,
      ]
    },
    '$$state': {
      'timeout_handle': null,
      'started': false,
      'timeout': 2000
    }
  };

  /* ------------------------------------------- PUBLIC FUNCTIONS --------------------------------------------------- */

  //Start watcher
  $this.start = async function() {

    var _user = await $twitterService.verifyCredentials();

    //No user no fun
    if(!_user) { return; }

    _data['user'] = _user;
    _data['$$state']['started'] = true;

    //Call to loop
    _loop();
  };

  //Stop watcher
  $this.stop = function() {

    //If timeout exists, clear it
    if(_data['$$state']['timeout_handle']) {
      clearTimeout(_data['$$state']['timeout_handle']);
    }

    //Clean upo data
    _cleanUpData();

    //Stop iterations
    _data['$$state']['started'] = false;

  };

  //Has started?
  $this.hasStarted = function() {
    return _data['$$state']['started'];
  };

  /* ------------------------------------------- PRIVATE FUNCTIONS -------------------------------------------------- */

  //Loop fn
  async function _loop() {

    //Not started or not user, no fun
    if(!_data['$$state']['started'] || !_data['user']) { return; }

    var _fn = _data['iteration']['fns'][_data['iteration']['count'] % _data['iteration']['fns'].length];

    //Increment iteration
    _data['iteration']['count']++;

    try {
      await _fn();
      _nextIteration();
    } catch($$error) {
      console.error($$error['data']);
      _nextIteration();
    }

    function _nextIteration() {
      //Call to next step
      _data['$$state']['timeout_handle'] = setTimeout(_loop, _data['$$state']['timeout']);
    }

  }

  //Cleans data
  function _cleanUpData() {

    _data['user'] = null;
    _data['followers'] = null;
    _data['mentions'] = null;

    _data['iteration']['count'] = 0;

    _data['$$state']['timeout_handle'] = null;
  }

  //Alert new follower
  async function _iteration_alertNewFollower() {
    var _followers = await $twitterService.getFollowers();

    //First iteration
    if(!_data['followers'] || !_data['followers'].length) {
      _data['followers'] = _followers['users'];
      return;
    }

    if(!_followers['users'].length) { return; }

    var _dataFollowersIds = _data['followers'].map((x) => x['id']);
    var _followersIds = _followers['users'].map((x) => x['id']);

    var _idxFirstId = _followersIds.indexOf(_dataFollowersIds[0]);

    //Only if first follower is later on list
    if(_idxFirstId > 0) {

      //For each new follower, send an alert to overlay
      _followers['users'].slice(0, _idxFirstId).forEach(($$newFollower) => {
        $log.debug('new follower @[%s]', $$newFollower['screen_name']);
        $overlaySocket.twitter.newFollower($$newFollower);
      });
    }

    //Followers now are as new followers
    _data['followers'] = _followers['users'];
  }

  //Mention alert
  async function _iteration_alertMention() {
    var _mentions = await $twitterService.getMentions();


    //First iteration
    if(!_data['mentions'] || !_data['mentions'].length) {
      _data['mentions'] = _mentions;
      return;
    }

    //If there are no mentions...
    if(!_mentions.length) { return; }

    var _dataMentionsId = _data['mentions'].map((x) => x['id']);
    var _mentionsIds = _mentions.map((x) => x['id']);

    var _idxFirstId = _mentionsIds.indexOf(_dataMentionsId[0]);

    //Only if first follower is later on list
    if(_idxFirstId > 0) {

      //For each new follower, send an alert to overlay
      _mentions.slice(0, _idxFirstId).forEach(($$newMention) => {
        $log.debug('new mention from @%s -> %s', $$newMention['user']['screen_name'], $$newMention['text']);
        $overlaySocket.twitter.newMention($$newMention);
      });
    }
  }





})();