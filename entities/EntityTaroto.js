const _ = require('lodash');
const options = require('./Options').taroto;
const ModelCrawler = require('../apps/Crawler');
const logger = require('../helpers/logger');
const cheerio = require('cheerio');


class EntityTaroto {
    constructor() {
        this.options = options
        this.crawler = new ModelCrawler('taroto', options);
    }

    async run() {
        const { settings, querys } = this.options, { levels } = querys, { isCreateUpdate, beginLevel, amount } = settings;

        const levelsQuery = this.getLevelsWork(levels, beginLevel, amount);

        await this.preDo(0, levelsQuery);
    }

    getLevelsWork(levels, beginLevel, amount) {

        return _.slice(levels, beginLevel, amount);
    }

    async preDo(counter, querys) {
        const query = querys[counter], { level } = query;

        if (level === 1) {

            const level0 = await this.sollutionFirstLevel(querys);
            if (level0) return await this.preDo(1, querys);
        }

        // dooooo
        await this.sollutionCrawler(query);

        // counter
        counter++;
        if (counter + 1 > querys.length) return logger.info(`I THINK DONE | LEVEL: ${level} ***********>>>>>>>`);

        return this.preDo(counter, querys);
    }

    async sollutionFirstLevel(querys) {
        const query = querys[0], { rootUrl, code, level, prefix } = query;

        logger.info(`***********>>>>>>> BEGIN | LEVEL:${level} ${rootUrl || ''}`)
        const title = 'First Site';
        const dRes = await this.crawler.createChilds([{ title, url: rootUrl, code: `${prefix}level${level}-${code}` }]);

        if (dRes.status === 400) {

            logger.info(`E | LEVEL ${level}`);
            return false;

        } else {

            if (querys.length === 1) return logger.info(`I  THINK DONE | LEVEL ${level} ***********>>>>>>>`);

            return true;
        }
    }

    async sollutionCrawler(query) {
        const { useFarmer, level, prefix, code } = query;

        const dRes = await this.crawler.getParentsHelper(`${prefix}level${level - 1}-${code}`);

        const { data, status } = dRes;

        if (status === 400) return logger.error(`GETRICE - GET PARENT FAILS`);
        if (data.length <= 0) return logger.error(`GETRICE - GET PARENT LENGTH 0`);

        for (let parent of data) {

            await this.sollutionCutRice(parent, query);

        };

        return true;
    }

    async sollutionCutRice(parent, query) {
        const rices = await this.cutRice(parent, query);

        if (!rices) return logger.info(`GETRICE NO RICE| LEVEL: ${query.level}`);

        const { isItem, description, childs } = rices;

        parent.status = 'DONE';
        parent.isItem = isItem;
        parent.childs = childs ? childs.length : 0;
        parent.description = description ? description : null;

        await this.crawler.saveRice(parent, childs);

        logger.info(`GETRICE TYPE: ${isItem ? 'ITEM' : 'CATEGORY'} | LEVEL: ${query.level} LENGTH: ${parent.childs} DESCRIPTION: ${parent.description ? 'CHANGE' : ''}`);
    }

    async cutRice(parent, query) {
        let { useFarmer, getItems, getLinks, getDetails, code, level, type, events, prefix } = query, { _id, url } = parent;

        let childs = null, description = null, isItem = false, getDescription = getDetails;

        const html = await this.crawler.getHTML(url);

        if (html.status !== 200) { return }

        type = this.checkType(url);

        if (type === 'item') {
            isItem = true;
            getDescription = getItems;

        } else {
            childs = await this.getInfoList(html.html, getLinks, _id, code, level, url, prefix);
        }

        description = await this.getInfoItem(html.html, getDescription);

        return { childs, description, isItem };
    }

    getInfoItem(html, getDetails) {

        const $ = cheerio.load(html);

        return this.getCurrentDetails($, getDetails);
    }

    getCurrentDetails($, getDetails) {

        let data = {};

        if (!Array.isArray(getDetails) || !$) return data;

        getDetails.forEach(gets => {
            const { nodes, get, name } = gets;
            let $childs = null;

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

    getInfoList(html, getLinks, parentId, code, level, url, prefix) {

        const $ = cheerio.load(html);

        return this.getChildsDetails($, getLinks, parentId, code, level, url, prefix);
    }

    getChildsDetails($, getLinks, parentId, code, level, url, prefix) {

        const $childsObject = this.getChilds($, getLinks);

        const { $childs, get, name } = $childsObject;

        if (!$childs) return [];

        let childs = [];

        $childs.each((index, item) => {
            try {
                const $item = $(item);
                const attribute = this.getAttibute($item, name, get);

                let { value } = attribute;

                if (get === 'href') value = this.validateUrl(name, value);

                let data = { url: value, code: `${prefix}level${level}-${code}`, level, parent: parentId };

                childs.push(data);
                logger.info(data);

            } catch (error) {
                logger.error(error);

            }
        });

        childs = _.uniq(childs, 'url');
        return childs;
    }

    getChilds($, getChilds) {

        let $childs = null, counter = 0;

        if (!Array.isArray(getChilds) || !$) {

            logger.error('getChilds wrong')
            return { $childs, counter };
        }

        if (getChilds.length <= 0) {
            return { $childs, counter };
        }

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

            default:
                {
                    value = $item.attr(get);
                    break;
                }
        }
        return { value, name };
    }

    checkType(url) {
        return url.search('/item/') >= 0 ? 'item' : 'category';
    }

    validateUrl(name, urlInput) {
        let urlOutput = urlInput.replace('../', this.options.url);

        if (urlOutput.search(this.options.url) === -1) {
            urlOutput = this.options.url + urlInput;
        }

        return urlOutput;
    }

}

module.exports = EntityTaroto;