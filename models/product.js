'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    Id: String,
    sku: String,
    name: String,
    price: Number,
    salePrice: Number,
    discount: String
})

module.exports = mongoose.model('Product', productSchema)