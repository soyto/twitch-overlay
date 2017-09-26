/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var router = express.Router();

  //panel middleware
  router.use(bodyParser.json());

  router.use('/window', require('./window'));

  return router;
})();