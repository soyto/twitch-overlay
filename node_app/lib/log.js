/* global */ 
module.exports = new (function () {
  var $this = this;

  var colors = require('colors');

  //Debug to console
  $this.debug = function () {
    var msg = arguments[0];
    var args = [];
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }

    console.log.apply(console.log, [colors.green('>>') + ' ' + msg].concat(args));
  }

  //Error to console
  $this.error = function() {
    var msg = arguments[0];
    var args = [];
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }

    console.error.apply(console.error, [colors.red('>>') + ' ' + msg].concat(args));
  };

})();