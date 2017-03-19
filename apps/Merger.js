const _ = require('lodash');

const logger = require('../helpers/logger');

const StoreDaizen = require('../repositories/StoreDaizen');
const StoreTaroto = require('../repositories/StoreTaroto');
const StoreMisubishi = require('../repositories/StoreMisubishi');
const StorePanasonic = require('../repositories/StorePanasonic');

const StoreCategory = require('../repositories/StoreCategory');
const StoreProduct = require('../repositories/StoreProduct');


class Merger {

    constructor(type) {

        this.StoreProduct = StoreProduct;
        this.StoreCategory = StoreCategory;
    }

    getStoreByType(type) {
        let Store = null;
        switch (type) {
            case 'taroto': {
                Store = new StoreTaroto();
                break;
            }
            case 'daizen': {
                Store = new StoreDaizen();
                break;
            }
            case 'panasonic': {
                Store = new StorePanasonic();
                break;
            } case 'misubishi': {
                Store = new StoreMisubishi();
                break;
            }
        }
        return Store;
    }

    async getCategoryByType(type, query) {

        const Store = this.getStoreByType(type);

        if (!Store) return console.log('Error');

        return await Store.find(query);
    }

    async getProductByType(type, query) {

        const Store = this.getStoreByType(type);

        if (!Store) return console.log('Error');

        return await Store.find(query);
    }

    async saveCategory(data) {
        return await this.StoreCategory.saveBatch(data);
    }

    async saveProduct(data) {
        return await this.StoreProduct.saveBatch(data);
    }

}

module.exports = ModelCrawler;