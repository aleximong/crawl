const _ = require('lodash');
const logger = require('../helpers/logger');
const Merger = require('../apps/Merger');

class EntityCategory {
    constructor() {
        this.merger = new Merger();
    }

    runByType(type) {
        //this.me
    }
}
module.exports = EntityCategory;