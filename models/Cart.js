const { Schema, model } = require( "mongoose");

const CartModel = new Schema({
    items: [
        {
            product: { type: Object, ref: 'Product' , required: true },
            quantity: { type: Number, default: 1 },
        },
    ],
    totalCount: {type: Number, default: 0 },
    totalPrice: {type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = model('Cart', CartModel)