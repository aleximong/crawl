const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    logger = require('../helpers/logger'),
    CreateUpdatedAt = require('mongoose-timestamp');

// Define Taroto Schema
const Taroto = new Schema({
    url: {
        type: String,
    },

    code: {
        type: String,
        default: ''
    },

    level: {
        type: Number,
        default: 0
    },

    title: {
        type: String,
    },

    description: {
        type: Object,
        default: {}
    },

    parent: {
        type: Schema.Types.ObjectId,
        default: null
    },

    isItem: {
        type: Boolean,
        default: false
    },

    childs: {
        type: Number,
        default: false
    },

    status: {
        type: String,
        default: 'WAIT'
    },
});

Taroto.plugin(CreateUpdatedAt);
module.exports = mongoose.model('Taroto', Taroto);