module.exports = function () {

  let _result = {};

  _result['cache'] = require('./cache');
  _result['timeout'] = require('./timeout');
  _result['generators'] = require('./generators');

  return _result;
}();