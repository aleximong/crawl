'use strict';
const express = require('express'),
    fs = require('fs'),
    config = require('config'),
    app = express(),
    yaml = require('js-yaml'),
    bodyParser = require('body-parser'),
    logger = require('./helpers/logger'),

    Farmer = require('./services/Farmer'),
    { EntityTaroto, EntityPanasonic, EntityMisubishi, EntityDaizen } = Farmer;
// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// add-on swagger-editor
//app.use('/swagger', express.static('./mocks/sites'));
app.use('/', express.static('./mocks/sites'));

app.get('/docs', function (req, res) {
    var docs = yaml.safeLoad(fs.readFileSync('./docs/swagger.yml', 'utf8'));
    res.send(JSON.stringify(docs));
});

app.get('/taroto/farmer', function (req, res) {
    console.log('taroto: ' + new Date().getTime());
    const farmer = new EntityTaroto();
    farmer.run();
    res.send("RUN taroto");
});

app.get('/denzai/farmer', function (req, res) {
    console.log('denzai: ' + new Date().getTime());
    const farmer = new EntityDaizen();
    farmer.run();
    res.send("RUN daizen");
});

app.get('/panasonic/farmer', function (req, res) {
    console.log('panasonic: ' + new Date().getTime());
    const farmer = new EntityPanasonic();
    farmer.run();
    res.send("RUN panasonic");
});

app.get('/mitsubishi/farmer', function (req, res) {
    console.log('mitsubishi: ' + new Date().getTime());
    const farmer = new EntityMisubishi();
    farmer.run();
    res.send("RUN mitsubishi");
});

// import routers
app.use(require('./apis'));

// start server
var server = app.listen(config.get('server.port'), config.get('server.host'), function () {
    var host = server.address().address;
    var port = server.address().port;
    logger.info('Server start at http://%s:%s', host, port);
});

module.exports = app;