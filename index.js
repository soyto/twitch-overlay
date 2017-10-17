var OAuth = require('oauth')['OAuth'];

const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const CONSUMER_KEY = 'pEB31grzFFwxotNME9FlZqFRF';
const CONSUMER_SECRET = 'CGWGvVATToP8zFxH9p1nQH4ySB4aH8aVeGRIR9VGvHpre46QHy';

const OAUTH_REQUEST_TOKEN = '5YdouQAAAAAA2zy9AAABXyw42Jw';
const OAUTH_REQUEST_SECRET = '8r5ffHcwk6izR99uCuUFkHprmvAiC9hq';
const OAUTH_REQUEST_VERIFIER = 'Q7PMOywNNrOSB9Z9LN1C2hbT0mqJkznI';

const OAUTH_ACCESS_TOKEN = '886845312211570688-nmTzFK04lfyJ4U5K05eIpt9dowGefCt';
const OAUTH_ACCESS_SECRET = 'YC9gB4sLMzJKS1pYRcFWxChZC8rC0LAQcrU4pFtu7JHxQ';

var _oa = new OAuth(
    REQUEST_TOKEN_URL,
    ACCESS_TOKEN_URL,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
);

/*
_oa.getOAuthRequestToken({'x_auth_access_type': 'write'}, (error, oauthToken, oauthTokenSecret, result) => {
  console.log(oauthToken);
  console.log(oauthTokenSecret);

  console.log('https://api.twitter.com/oauth/authorize?oauth_token=' + oauthToken);
});
*/

_oa.getOAuthAccessToken(OAUTH_REQUEST_TOKEN, OAUTH_REQUEST_SECRET, OAUTH_REQUEST_VERIFIER, (error, oAuthToken, oAuthSecretToken) => {
  console.log(oAuthToken);
  console.log(oAuthSecretToken);
});