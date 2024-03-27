const { Schema, model } = require( "mongoose");

const TransactionModel = new Schema({
    items: [
        {
            product: { type: Object, ref: 'Product' , required: true },
            quantity: { type: Number, default: 1 },
        },
    ],
    status: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    total: { type: Number, default: 0 },
    date_create: { type: Date, default: Date.now },
})

module.exports = model('Transaction', TransactionModel)