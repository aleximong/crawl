'use strict';
const express = require('express'), router = express.Router();

// add modification header
router.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

router.use('/api/v1/taroto', require('./Taroto'));
router.use('/api/v1/daizen', require('./Daizen'));
router.use('/api/v1/panasonic', require('./Panasonic'));
router.use('/api/v1/mishbishi', require('./Mishubishi'));

module.exports = router;