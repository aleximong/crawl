const db = require('../models');
class Store {
    constructor() {
        this.Rice = db.Daizen;
    }

    saveOne(data) {
        return this.Rice.create(data).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, error }
        });
    }

    saveBatch(data) {
        return this.Rice.insertMany(data).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, data: error }
        });
    }

    find(query) {
        return this.Rice.find(query).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, error }
        });
    }

    update(id, model) {
        return this.Rice.update({ _id: id }, model).then(data => {
            return { status: 200, data }
        }).catch(error => {
            return { status: 400, error }
        });
    }
}
module.exports = Store;