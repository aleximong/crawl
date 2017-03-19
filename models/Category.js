const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    logger = require('../helpers/logger'),
    CreateUpdatedAt = require('mongoose-timestamp');

// Define Category Schema
const Category = new Schema({
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

    path: {
        type: String,
        default: ''
    },

    level: {
        type: Number,
        default: 0
    },

    parent: {
        type: Schema.Types.ObjectId,
        default: null
    },

    isAtive: {
        type: Boolean,
        default: false
    },
});

Category.plugin(CreateUpdatedAt);
module.exports = mongoose.model('Category', Category);