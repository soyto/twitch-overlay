/* global */
module.exports = new (function() {
  var $this = this;


  var $moment = require('moment');

  var $log = require('../lib/log');
  var $overlaySocket = require('../sockets/')['overlay'];
  var $panelSocket = require('../sockets/')['panel'];
  var $twitchService = require('./twitch.service');

  var _data = {
    'user': null,
    'iteration': {
      'count': 0,
      'fns': [
        _iteration_overlay_newFollowers,
        _iteration_panel_streamInfo,
        _iteration_panel_channelInfo,
        _iteration_panel_lastFollower,
      ],
    },
    'last_followers_date': null,
    '$$state': {
      'timeout_handle': null,
      'started': false,
      'timeout': 2000,
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

    _data['last_followers_date'] = null;

    _data['$$state']['timeout_handle'] = null;
  }

  //Watch new folloers
  async function _iteration_overlay_newFollowers() {

    //Retrieve followers data
    var _followers = await $twitchService.getFollowers(_data['user']['id']);

    if(!_data['last_followers_date'] && _followers['data'].length) {
      _data['last_followers_date'] = $moment(_followers['data'][0]['followed_at']);
      return;
    }
    else if(!_followers['data'].length) {
      return;
    }

    var _newFollowers = _followers['data'].filter(($$follower) => _data['last_followers_date'].diff($moment($$follower['followed_at'])) < 0);

    //No new followers, no party
    if(!_newFollowers || !_newFollowers.length) { return; }

    //Update last folloers_date
    _data['last_followers_date'] = $moment(_newFollowers[0]['followed_at']);

    var _users = await $twitchService.getUsers(_newFollowers.map((x) => x['from_id']));

    _users['data'].forEach(($$newFollower) => {
      $log.debug('Twitch API: new follower %s', $$newFollower['display_name']);
      $overlaySocket.twitch.newFollower($$newFollower);
    });
  }

  //Channel info iteration
  async function _iteration_panel_channelInfo() {
    var _channelInfo = await $twitchService.getChannel(_data['user']['login']);
    $panelSocket.pushTwitchChannelInfo(_channelInfo);
  }

  //Panel last follower
  async function _iteration_panel_lastFollower() {

    //Retrieve followers data
    var _followers = await $twitchService.getFollowers(_data['user']['id']);

    if(!_followers['data'].length) { return; }

    var _user = await $twitchService.getUser(_followers['data'][0]['from_id']);

    $panelSocket.pushTwitchLastFollower(_user);
  }

  //Stream info iteration
  async function _iteration_panel_streamInfo() {
    var _streamInfo = await $twitchService.getStream(_data['user']['id']);
    $panelSocket.pushTwitchStreamStatus(_streamInfo);
  }
})();