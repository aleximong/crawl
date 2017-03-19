const _ = require('lodash');
const options = require('./Options').misubishi;
const ModelCrawler = require('../apps/Crawler');
const logger = require('../helpers/logger');
const cheerio = require('cheerio');
const EntityBase = require('./EntityBase');

class EntityMisubishi extends EntityBase {
    constructor() {
        super();
        this.options = options
        this.crawler = new ModelCrawler('misubishi', options);
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
                    url = url.replace('lnaviCategory', 'searchProductResult');

                    value = this.createUrlByPage(value);

                    for (let i = 1; i <= value; i++) {
                        newUrl = url.replace('pageNo=1', `pageNo=${i}`);
                        let data = { url: value, code: `${prefix}level${level}-${code}`, level, parent: parentId };
                        childs.push(data);
                        logger.info(data);
                    }
                    return;
                };

                if (name === 'linkCode') {
                    value = this.createUrlByCode(value);
                    if (level >= 4) {
                        value = value.replace('lnaviCategory', 'searchProductResult')
                    }
                }

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

    createUrlByCode(urlInput) {
        const urlOutput = `http://www.mitsubishielectric.co.jp/ldg/wink/lnaviCategory.do#ccd=${urlInput}&releaseFrom=&releaseTo=&oldProductFlg=&pageNo=1&fanaFlg=0&searchType=pName&showAllFlg=true`;
        return urlOutput;
    }

    createUrlByPage(urlInput) {
        return urlInput == null ? 1 : parseInt(urlInput);
    }

}

module.exports = EntityMisubishi;