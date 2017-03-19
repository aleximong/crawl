const Crawler = require('crawler');
const Promise = require('bluebird');
const cheerio = require('cheerio');

class Farmer {
    constructor(options) {
        this.options = options;

        const { maxConcurrent, rateLimit } = this.options;

        this.farmer = new Crawler({
            rateLimit,
            maxConcurrent
        });
    }

    async run() {
        const { url, code, level, getItems, getLinks, getDetails, parentId } = this.options;

        const html = await this.getHtml(url);

        let itemDetails = null, childs = null, rices = null;

        if (html.status === 200) {
            rices = await this.getInfo(html.html, getLinks, getDetails, _id, code, level);
            childs = rices.childs;
        };

        if (html.status === 200) {
            itemDetails = await this.getItemDetails(html.html, getItems);
        };

    }

    async runGetInfo() {
        const { url, code, level, getItems, getLinks, getDetails, parentId } = this.options;

        console.log(`RUN - GET INFO - URL: ${url}`)

        const html = await this.getHtml(url);

        let itemDetails = null, childs = null, rices = null;

        if (html.status === 200) {
            rices = await this.getInfo(html.html, getLinks, getDetails, parentId, code, level, url);
        } else {
            console.log(`RUN - GET INFO - FAILS`);
        }

        console.log(`RUN - GET INFO - DONE`, rices)
        return rices;
    }

    async getInfo(html, getLinks, getDetails, parentId, code, level, url) {
        const $ = cheerio.load(html);

        const description = this.getCurrentDetails($, getDetails);
        const childs = this.getChildsDetails($, getLinks, parentId, code, level, url);
        return { description, childs }
    }

    async getItemDetails(html, getItems) {
        const $ = cheerio(html);
        const description = this.getCurrentDetails($, getDetails);
        return { description }
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
                        console.info(data);
                        childs.push(data);
                    }
                    if (value === 0) {
                        data = { url: url, code, level, parent: parentId };
                        childs.push(data);
                    }
                    return;
                }
                childs.push(data);
                console.log(data);
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

    validateUrl(name, urlInput) {
        let urlOutput = urlInput.replace('../', this.options.url);
        if (name === 'linkCode') {
            urlOutput = `http://www.mitsubishielectric.co.jp/ldg/wink/lnaviCategory.do#ccd=${urlInput}&releaseFrom=&releaseTo=&oldProductFlg=&pageNo=1&fanaFlg=0&searchType=pName&showAllFlg=true`

        } else if (name === 'linkPage') {
            console.log('number', urlInput);
            if (!urlInput) urlInput = 0;
            urlInput = Math.round((parseInt(urlInput) / 50 + 0.5));
        } else {
            if (urlOutput.search(this.options.url) === -1) {
                urlOutput = this.options.url + urlInput;
            }
        }

        return urlOutput;
    }

    getHtml(url) {
        console.log('url', url)
        return new Promise((respone, reject) => {
            const config = {
                uri: url,
                jQuery: false,
                callback: (error, reply, done) => {
                    if (error) {
                        console.error(`CUTRICE CONNECT FAIL - URL: ${url}`, error);
                        done();
                        return respone();
                    }

                    console.log(`CUTRICE - CONNECT SUCCESS - URL: ${url}`);

                    done();
                    return respone({ status: 200, html: reply.body });
                }
            }
            this.farmer.queue(config);
        })
    }
}

module.exports = Farmer;