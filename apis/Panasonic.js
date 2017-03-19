'use strict';
const express = require('express'),
    router = express.Router(),
    db = require('../models'),
    logger = require('../helpers/logger'),
    moment = require('moment'),
    config = require('config');

// get a Category by id
const Store = db.Panasonic;
router.get('/get/:id', function (req, res) {
    logger.debug('Get Categories By Id', req.params.id);
    Store.findOne({
        _id: req.params.id
    }).then(function (category) {
        res.send(JSON.stringify(category));
    }).catch(function (e) {
        res.status(500).send(JSON.stringify(e));
    });
});

// get list of Categories
router.get('/list/:page/:limit', function (req, res) {
    var limit = (req.params.limit) ? parseInt(req.params.limit) : 10;
    var skip = (req.params.page) ? limit * (req.params.page - 1) : 0;
    skip = skip <= 0 ? 0 : skip;
    Store.count({}, function (err, c) {
        Store
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ '_id': 'desc' })
            .then(function (categories) {
                if (err) {
                    throw true;
                }
                var ret = {
                    count: c,
                    rows: categories
                };
                res.json(ret);
            }).catch(function (e) {
                res.status(500).send(JSON.stringify(e));
            });
    });
});

module.exports = router;