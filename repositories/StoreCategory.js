const db = require('../models');
class Store {
    constructor() {
        this.Store = db.Category;
    }

    saveOne(data) {
        return this.Store.create(data).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, error }
        });
    }

    saveBatch(data) {
        return this.Store.insertMany(data).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, data: error }
        });
    }

    find(query) {
        return this.Store.find(query).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, error }
        });
    }

    update(id, model) {
        return this.Store.update({ _id: id }, model).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, error }
        });
    }
}
module.exports = Store;