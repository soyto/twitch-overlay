/*global */
module.exports = (function() {
  'use strict';

  let _result = {};

  _result['server'] = {
    'port': 80
  };

  _result['twitch'] = {
    'clientID': 'eplbp72ytgf9g6f1h7td2q1fm1c6dl',
    'redirectURI': 'http://localhost/twitch-login/'
  };

  _result['twitter'] = {
    'CONSUMER_KEY': 'pEB31grzFFwxotNME9FlZqFRF',
    'CONSUMER_SECRET': 'CGWGvVATToP8zFxH9p1nQH4ySB4aH8aVeGRIR9VGvHpre46QHy'
  };

  _result['debug'] = {
    'twitter.service': true
  };

  _result['persist'] = {
    'pretty_print': true
  };


  return _result;
})();