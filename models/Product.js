const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    logger = require('../helpers/logger'),
    CreateUpdatedAt = require('mongoose-timestamp');

// Define Product Schema
const Product = new Schema({
    code: {
        type: Object,
        default: {}
    },

    name: {
        type: String,
    },

    title: {
        type: String,
    },

    url: {
        type: String,
        default: ''
    },

    feature: {
        type: String,
        default: ''
    },

    details: {
        type: String,
        default: ''
    },

    quality: {
        type: Number,
        default: 0
    },

    price: {
        type: Number,
        default: 0
    },

    categories: {
        type: Schema.Types.ObjectId,
        default: null
    },

    brand: {
        type: Schema.Types.ObjectId,
        default: null
    },

    publishDate: {
        type: Boolean,
        default: false
    },

    isAtive: {
        type: Boolean,
        default: false
    },
});

Product.plugin(CreateUpdatedAt);
module.exports = mongoose.model('Product', Product);