const _ = require('lodash');
const Crawler = require('crawler');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const logger = require('../helpers/logger');
const StoreDaizen = require('../repositories/StoreDaizen');
const StoreTaroto = require('../repositories/StoreTaroto');
const StoreMisubishi = require('../repositories/StoreMisubishi');
const StorePanasonic = require('../repositories/StorePanasonic');

class ModelCrawler {

    constructor(type, options) {
        this.options = options;
        this.setFarmer();
        this.setType(type);
    }

    setType(type) {

        this.type = type;
        switch (type) {
            case 'taroto': {
                this.Store = new StoreTaroto();
                break;
            }
            case 'daizen': {
                this.Store = new StoreDaizen();
                break;
            }
            case 'misubishi': {
                this.Store = new StoreMisubishi();
                break;
            }
            case 'panasonic': {
                this.Store = new StorePanasonic();
                break;
            }
        }
    }

    setFarmer() {
        let { maxConcurrent, rateLimit } = this.options;
        if (!maxConcurrent) maxConcurrent = 10;
        if (!rateLimit) rateLimit = 1000;
        this.farmer = new Crawler({
            maxConcurrent,
            rateLimit
        });
    }

    getHTML(url) {
        return new Promise((respone, reject) => {
            const config = {
                uri: url,
                jQuery: true,
                callback: (error, reply, done) => {
                    if (error) {
                        logger.error(`CUTRICE CONNECT FAIL - URL: ${url}`, error);
                        done();
                        return respone();
                    }

                    logger.info(`CUTRICE - CONNECT SUCCESS - URL: ${url}`);
                    done();
                    return respone({ status: 200, html: reply.body });
                }
            }
            this.farmer.queue(config);
        });
    };

    getInfo(html, getLinks, getDetails, parentId, code, level, url) {
        const $ = cheerio.load(html);

        const description = this.getCurrentDetails($, getDetails);
        const childs = this.getChildsDetails($, getLinks, parentId, code, level, url);

        return { description, childs }
    }

    getItemDetails(html, getItems) {
        const $ = cheerio(html);

        const description = this.getCurrentDetails($, getDetails);

        return { description }
    }

    getChildsByFarmer($, getChilds) {
        let $childs = null,
            counter = 0;
        if (!Array.isArray(getChilds) || !$) return { $childs, counter };

        getChilds.some((gets, index) => {
            const { nodes, get, name } = gets;
            counter = index;

            if (!Array.isArray(nodes) || !get || !name) return;

            nodes.forEach((node, index) => {

                const { selector, type } = node;
                if (index === 0) {
                    $childs = $(selector);
                } else {
                    if (type === 'children') {
                        $childs = $childs.children(selector);
                    } else if (type === 'parent') {
                        $childs = $childs.parent(selector);
                    } else {
                        $childs = $childs.find(selector);
                    }
                }
            });

            if (!$childs) return;
        });

        const { get, name } = getChilds[counter];
        return { $childs, get, name };
    }

    getChildsDetails($, gets, parentId, code, level, url) {

        const $childsObject = this.getChildsByFarmer($, gets);
        const { $childs, get, name } = $childsObject;

        if (!$childs) return [];

        let childs = [];
        $childs.each((index, item) => {
            try {
                const $item = $(item);
                const attribute = this.getAttibute($item, name, get);
                let { value } = attribute;

                if (get === 'href' || get === 'ccd' || get == 'number') value = this.validateUrl(name, value);

                let data = { url: value, code, level, parent: parentId };

                if (get === 'code' && name === 'linkCode') {
                    if (level >= 3) url.replace('lnaviCategory', 'searchProductResult')
                }

                if (get === 'number' && name === 'linkPage') {
                    if (level >= 4) url.replace('lnaviCategory', 'searchProductResult');
                    for (let i = 1; i <= value; i++) {
                        let urlPage = url.replace('pageNo=1', `pageNo=${i}`);
                        data = { url: urlPage, code, level, parent: parentId };
                        logger.info(data);
                        childs.push(data);
                    }
                    if (value === 0) {
                        data = { url: url, code, level, parent: parentId };
                        childs.push(data);
                    }
                    return;
                }
                childs.push(data);
                logger.info(data);
            } catch (error) {
                logger.error(error);
            }
        });
        childs = _.uniq(childs, 'url');
        return childs;
    }

    getCurrentDetails($, getDetails) {
        let data = {};
        if (!Array.isArray(getDetails) || !$) return data;

        getDetails.forEach(gets => {
            const { nodes, get, name } = gets;
            let $childs;
            if (!Array.isArray(nodes) || !get || !name) return;

            nodes.forEach((node, index) => {
                const { selector, type } = node;
                if (index === 0) {
                    $childs = $(selector);
                } else {

                    if (type === 'children') {
                        $childs = $childs.children(selector);
                    } else if (type === 'parent') {
                        $childs = $childs.parent(selector);
                    } else {
                        $childs = $childs.find(selector);
                    }
                }
            });
            data[name] = this.getAttibute($childs, name, get);
        });
        return data;
    }

    getAttibute($item, name, get) {
        let value = '';
        switch (get) {
            case 'text':
                {
                    value = $item.text();
                    break;
                }
            case 'html':
                {
                    value = $item.html();
                    break;
                }
            case 'title':
                {
                    value = $item.title();
                    break;
                }
            case 'src':
                {
                    value = $item.attr('src');
                    break;
                }
            case 'href':
                {
                    value = $item.attr('href');
                    break;
                }
            case 'ccd':
                {
                    value = $item.attr('ccd');
                    break;
                }
            case 'number':
                {
                    value = $item.attr('number');
                    break;
                }
            default:
                {
                    value = '';
                }
        }
        return { value, name };
    }

    async saveRice(parent, childs) {

        const childsBatch = _.uniq(childs);

        const createChilds = await this.createChilds(childsBatch);

        const model = _.pick(parent, ['description', 'status', 'childs', 'isItem']);

        const updateParent = await this.updateParent(parent._id, model);

        return { createChilds, updateParent }
    }

    async createChilds(childsBatch) {
        return await this.Store.saveBatch(childsBatch);
    }

    async updateParent(id, model) {
        return await this.Store.update(id, model);
    }

    async getParentsHelper(code) {
        const q = { code: new RegExp('^' + code + '$', "i"), status: 'WAIT' };
        return await this.Store.find(q);
    }
}

module.exports = ModelCrawler;