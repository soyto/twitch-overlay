/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var $log = require('../../lib/log');
  var $persistence = require('../../persistence/jsonSorage');
  var $twitterService = require('./../../services')['twitter'];
  var $overlaySocket = require('../../sockets')['overlay'];


  router.get('/verify', async(req, res) => {
    try {
      var _verify = await $twitterService.verifyCredentials();
      res.json(_verify);
    } catch($$error) {
      console.log($$error);
      res.end();
    }
  });

  //Get access token
  router.get('/access_token', async(req, res) => {
    var _request_token = req.query.oauth_token;
    var _request_verify = req.query.oauth_verifier;

    var _token = $persistence.getOAuthTwitterRequestToken();

    if(_request_token != _token['token']) {
      res.redirect('/');
      return;
    }

    await $twitterService.verifyRequestToken(_request_token, _token['secret'], _request_verify);

    res.redirect('/');
  });

  //get Token
  router.get('/token', async (req, res) => {
    var _accessURI = await $twitterService.generateRequestToken();

    res.send({
      'uri': _accessURI
    });
  });


  //
  // SIMULATION
  // ----------

  //On simulate new follower
  router.post('/simulate/newFollower', async (req, res) => {
    
    let _followerInfo = {
      'id': 2960784075,
      'id_str': '2960784075',
      'name': 'Jesus Rafael Abreu M',
      'screen_name': 'chuomaraver',
      'location': '',
      'profile_location': null,
      'url': null,
      'description': '',
      'protected': false,
      'followers_count': 1,
      'friends_count': 101,
      'listed_count': 0,
      'created_at': 'Sun Jan 04 19:58:06 +0000 2015',
      'favourites_count': 0,
      'utc_offset': null,
      'time_zone': null,
      'geo_enabled': false,
      'verified': false,
      'statuses_count': 0,
      'lang': 'es',
      'contributors_enabled': false,
      'is_translator': false,
      'is_translation_enabled': false,
      'profile_background_color': 'C0DEED',
      'profile_background_image_url': 'http://abs.twimg.com/images/themes/theme1/bg.png',
      'profile_background_image_url_https': 'https://abs.twimg.com/images/themes/theme1/bg.png',
      'profile_background_tile': false,
      'profile_image_url': 'http://abs.twimg.com/sticky/default_profile_images/default_profile_4_normal.png',
      'profile_image_url_https': 'https://abs.twimg.com/sticky/default_profile_images/default_profile_4_normal.png',
      'profile_link_color': '0084B4',
      'profile_sidebar_border_color': 'C0DEED',
      'profile_sidebar_fill_color': 'DDEEF6',
      'profile_text_color': '333333',
      'profile_use_background_image': true,
      'default_profile': true,
      'default_profile_image': true,
      'following': false,
      'follow_request_sent': false,
      'notifications': false,
      'muting': false
    };
    
    $overlaySocket.twitter.newFollower(_followerInfo);
    res.end();
  });

  //On simulate new mention
  router.post('/simulate/newMention', async (req, res) => {

    let _mentionInfo = {
      'coordinates': null,
      'favorited': false,
      'truncated': false,
      'created_at': 'Mon Sep 03 13:24:14 +0000 2012',
      'id_str': '242613977966850048',
      'entities': {
        'urls': [],
        'hashtags': [],
        'user_mentions': [
          {
            'name': 'Jason Costa',
            'id_str': '14927800',
            'id': 14927800,
            'indices': [
              0,
              11
            ],
            'screen_name': 'jasoncosta'
          },
          {
            'name': 'Matt Harris',
            'id_str': '777925',
            'id': 777925,
            'indices': [
              12,
              26
            ],
            'screen_name': 'themattharris'
          },
          {
            'name': 'ThinkWall',
            'id_str': '117426578',
            'id': 117426578,
            'indices': [
              109,
              119
            ],
            'screen_name': 'thinkwall'
          }
        ]
      },
      'in_reply_to_user_id_str': '14927800',
      'contributors': null,
      'text': '@jasoncosta @themattharris Hey! Going to be in Frisco in October. Was hoping to have a meeting to talk about @thinkwall if you\'re around?',
      'retweet_count': 0,
      'in_reply_to_status_id_str': null,
      'id': 242613977966850048,
      'geo': null,
      'retweeted': false,
      'in_reply_to_user_id': 14927800,
      'place': null,
      'user': {
        'profile_sidebar_fill_color': 'EEEEEE',
        'profile_sidebar_border_color': '000000',
        'profile_background_tile': false,
        'name': 'Andrew Spode Miller',
        'profile_image_url': 'http://a0.twimg.com/profile_images/1227466231/spode-balloon-medium_normal.jpg',
        'created_at': 'Mon Sep 22 13:12:01 +0000 2008',
        'location': 'London via Gravesend',
        'follow_request_sent': false,
        'profile_link_color': 'F31B52',
        'is_translator': false,
        'id_str': '16402947',
        'entities': {
          'url': {
            'urls': [
              {
                'expanded_url': null,
                'url': 'http://www.linkedin.com/in/spode',
                'indices': [
                  0,
                  32
                ]
              }
            ]
          },
          'description': {
            'urls': [

            ]
          }
        },
        'default_profile': false,
        'contributors_enabled': false,
        'favourites_count': 16,
        'url': 'http://www.linkedin.com/in/spode',
        'profile_image_url_https': 'https://si0.twimg.com/profile_images/1227466231/spode-balloon-medium_normal.jpg',
        'utc_offset': 0,
        'id': 16402947,
        'profile_use_background_image': false,
        'listed_count': 129,
        'profile_text_color': '262626',
        'lang': 'en',
        'followers_count': 2013,
        'protected': false,
        'notifications': null,
        'profile_background_image_url_https': 'https://si0.twimg.com/profile_background_images/16420220/twitter-background-final.png',
        'profile_background_color': 'FFFFFF',
        'verified': false,
        'geo_enabled': true,
        'time_zone': 'London',
        'description': 'Co-Founder/Dev (PHP/jQuery) @justFDI. Run @thinkbikes and @thinkwall for events. Ex tech journo, helps run @uktjpr. Passion for Linux and customises everything.',
        'default_profile_image': false,
        'profile_background_image_url': 'http://a0.twimg.com/profile_background_images/16420220/twitter-background-final.png',
        'statuses_count': 11550,
        'friends_count': 770,
        'following': null,
        'show_all_inline_media': true,
        'screen_name': 'spode'
      },
      'in_reply_to_screen_name': 'jasoncosta',
      'source': 'JournoTwit',
      'in_reply_to_status_id': null
    };

    $overlaySocket.twitter.newMention(_mentionInfo);
    res.end();
  });

  return router;

})();