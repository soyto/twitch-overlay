module.exports = function () {

  let _result = {};

  _result['cache'] = require('./cache');
  _result['timeout'] = require('./timeout');

  return _result;
}();