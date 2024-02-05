const { Schema, model } = require('mongoose')

const Product = new Schema({
    seo_title: { type: String, require: true, min: 3 },
    seo_description: { type: String, require: true, min: 3 },
    name: { type: String, require: true, min: 3, unique: true },
    slug: { type: String, require: true, min: 3, unique: true },
    price: { type: Number, require: true },
    description: { type: String },
    rang: { type: Number, require: true, min: 1, max: 6, default: 1},
    type: { type: String, require: true },
    category: { type: String},
    tag: { type: String, require: true },
    img: { type: String, require: true, default: 'default.img' },
    isPopular: { type: Boolean, default: false },
    date_create: { type: Date, default: Date.now },
})

module.exports = model('Product', Product)