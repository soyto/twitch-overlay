/* global */
(function () {
    'use strict';

    var fs = require('fs');
    var express = require('express');
    var app = express();

    app.use('/', express.static('panel'));
    app.use('/overlay/', express.static('overlay'));
    app.use('/assets/bower', express.static('bower'));

    app.get('/hola/', function (req, res) {

        res.send('hello ' + req.query.message1 + ' message2: ' + req.query.message2);
    });

    app.listen(80, function () {
        console.log('Server is started in port 80');
    });
})();
