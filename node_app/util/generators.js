module.exports = function() {

  var $is = require('is_js');

  var $this = {};

  //Generates a random text
  $this.randomText = function(format, numericOnly) {

    if(format == null || $is.empty(format)) { format = 'xxxxxxxx-xxxxx-xx'; }
    if(numericOnly == null) { numericOnly = false; }

    if(numericOnly) {
      return format.replace(/[x]/g, (c) => Math.random() * 10 | 0);
    }
    else {
      return format.replace(/[x]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
  };


  return $this;
}();