const _ = require('lodash');
const options = require('./Options').panasonic;
const ModelCrawler = require('../apps/Crawler');
const logger = require('../helpers/logger');
const cheerio = require('cheerio');
const EntityBase = require('./EntityBase');

class EntityPanasonic extends EntityBase {
    constructor() {
        super();
        this.options = options
        this.crawler = new ModelCrawler('panasonic', options);
    }
}

module.exports = EntityPanasonic;