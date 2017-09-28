/* global */
module.exports = (function() {
  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var router = express.Router();
  var $persistence = require('../../persistence/jsonSorage');

  //panel middleware
  router.use(bodyParser.json());

  router.get('/', ($$req, $$res) => {
    $$res.json($persistence.getProfile());
  });

  return router;
})();