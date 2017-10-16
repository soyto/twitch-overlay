module.exports = function() {

  return function(time) {
    var _promise = new Promise();



    setTimeout(() => _promise.resolve(), time);

    return _promise;
  }

}();