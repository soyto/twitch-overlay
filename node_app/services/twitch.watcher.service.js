/* global */
module.exports = new (function() {
  var $this = this;

  var $log = require('../lib/log');
  var $overlaySocket = require('../sockets/')['overlay'];
  var $panelSocket = require('../sockets/')['panel'];
  var $twitchService = require('./twitch.service');

  var _data = {
    'user': null,
    'iteration': {
      'count': 0,
      'fns': [
        _iteration_panel_streamInfo,
        _iteration_panel_channelInfo,
        _iteration_overlay_newFollowers
      ],
    },
    'followers': [],
    '$$state': {
      'timeout_handle': null,
      'started': false,
      'timeout': 5000,
    }
  };

  /* ------------------------------------------- PUBLIC FUNCTIONS --------------------------------------------------- */

  //Start watcher
  $this.start = async function() {

    //Retreive user
    var _user = await $twitchService.getCurrentUser();

    //If we dont have user, we cannot loop..
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

    //Clean data
    _cleanUpData();

    //Stop iterations...
    _data['$$state']['started'] = false;
  };

  //Has started?
  $this.hasStarted = function() {
    return _data['$$state']['started'];
  };


  /* ------------------------------------------- PRIVATE FUNCTIONS -------------------------------------------------- */

  //Loop fn
  async function _loop() {

    if(!_data['$$state']['started'] || !_data['user']) { return; }

    var _fn = _data['iteration']['fns'][_data['iteration']['count'] % _data['iteration']['fns'].length];

    //Increment iterations
    _data['iteration']['count']++;

    try {
      await _fn();
      _nextIteration();
    } catch($error) {
      console.error($error['message']);
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
    _data['iteration']['count'] = 0;

    _data['followers'] = [];

    _data['$$state']['timeout_handle'] = null;
  }

  //Watch new folloers
  async function _iteration_overlay_newFollowers() {

    //Retrieve followers data
    var _followers = (await $twitchService.getFollowers(_data['user']['id']))['data'];

    //First iteration?
    if(!_data['followers'] || !_data['followers'].length) {
      _data['followers'] = _followers;
      return;
    }

    var _newFollowers = [];

    _followers.forEach(($$nFollower) => {
      let _exists = !_data['followers'].every(($$oFollower) => $$nFollower['from_id'] != $$oFollower['from_id']);

      if(!_exists) {
        _newFollowers.push($$nFollower);
      }
    });


    //No new followers, no party
    if(!_newFollowers || !_newFollowers.length) { return; }

    //Push new followers
    _newFollowers.forEach(($$follower) => _data['followers'].push($$follower));

    var _users = await $twitchService.getUsers(_newFollowers.map((x) => x['from_id']));

    _users['data'].forEach(($$newFollower) => {
      $log.debug('Twitch API: new follower %s', $$newFollower['display_name']);
      $overlaySocket.twitch_newFollower($$newFollower);
    });
  }

  //Channel info iteration
  async function _iteration_panel_channelInfo() {
    var _channelInfo = await $twitchService.getChannel(_data['user']['login']);
    $panelSocket.pushTwitchChannelInfo(_channelInfo);
  }

  //Stream info iteration
  async function _iteration_panel_streamInfo() {
    var _streamInfo = await $twitchService.getStream(_data['user']['id']);
    $panelSocket.pushTwitchStreamStatus(_streamInfo);
  }
})();