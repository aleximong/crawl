'use strict';
let fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    db = {},
    config = require('config');

mongoose.connect(config.get('db.uri'));
mongoose.Promise = global.Promise;
// import all file in this dir, except index.js
fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        var model = require(path.join(__dirname, file));
        db[model.modelName] = model;
    });

db.mongoose = mongoose;
module.exports = db;