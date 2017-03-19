const _ = require('lodash');
const options = require('./Options').daizen;
const ModelCrawler = require('../apps/Crawler');
const logger = require('../helpers/logger');
const cheerio = require('cheerio');
const EntityBase = require('./EntityBase');

class EntityDaizen extends EntityBase {
    constructor() {
        super();
        this.options = options;
        this.productPerPage = 30;
        this.crawler = new ModelCrawler('daizen', options);
    }

    async cutRice(parent, query) {
        let { useFarmer, getItems, getLinks, getDetails, code, level, type, events, prefix } = query, { _id, url } = parent;

        let childs = null, description = null, isItem = false;

        const html = await this.crawler.getHTML(url);

        if (html.status !== 200) { return }
        let htmlNew = null;
        try {
            htmlNew = JSON.parse(html.html);
        } catch (error) {
            return;
        }

        const $ = cheerio.load(htmlNew.html);

        if (type === 'item') {
            childs = await this.getInfoItem($, getItems, getDetails, _id, code, level, url, prefix);
        } else {
            childs = await this.getInfoList($, getLinks, _id, code, level, url, prefix);
        }
        logger.info(childs);
        return { childs, description, isItem };
    }

    getInfoItem($, getItems, getDetails, parentId, code, level, url, prefix) {

        const $listItem = this.getListItem($, getDetails);

        if (!Array.isArray(getItems) || !$) return [];


        return $listItem.map((index, item) => {

            const $item = $(item);
            let data = {}, productUrl = '';
            getItems.forEach(gets => {

                const { nodes, get, name } = gets;
                let $childs = null;

                if (!Array.isArray(nodes) || !get || !name) return;

                nodes.forEach((node, index) => {
                    const { selector, type } = node;
                    if (index === 0) {
                        $childs = $item.find(selector);

                    } else {
                        if (type === 'children') {
                            $childs = $childs.children(selector);
                        } else if (type === 'parent') {
                            $childs = $childs.parent(selector);
                        } else if (type === 'eq') {
                            $childs = $childs.eq(selector);
                        } else {
                            $childs = $childs.find(selector);
                        }
                    }
                });
                data[name] = this.getAttibute($childs, name, get);
                if (name === 'product_url') productUrl = data[name].value;

                return data;
            });
            return { status: 'DONE', description: data, parent: parentId, code: `${prefix}level${level}-${code}`, url: productUrl, isItem: true };
        });
    }

    getListItem($, getDetails) {
        if (getDetails.length <= 0) return [];
        const { nodes } = getDetails[0];
        const { selector } = nodes[0];
        return $(selector);
    }

    getChildsDetails($, getLinks, parentId, code, level, url, prefix) {

        const $childsObject = this.getChilds($, getLinks);

        const { $childs, get, name } = $childsObject;

        if (!$childs) return [];

        let childs = [];

        $childs.each((index, item) => {
            try {

                const attribute = this.getAttibute($(item), name, get);

                let { value } = attribute;

                if (name === 'linkPage') {

                    value = this.createUrlByPage(value);
                    const numberPage = parseInt(value / this.productPerPage) + 1;
                    for (let i = 1; i <= numberPage; i++) {
                        const newUrl = url + i;
                        let data = { url: newUrl, code: `${prefix}level${level}-${code}`, level, parent: parentId };
                        childs.push(data);
                        logger.info(data);
                    }
                    return;
                };

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

    createUrlByPage(urlInput) {
        return urlInput == null ? 1 : parseInt(urlInput);
    }
}


module.exports = EntityDaizen;