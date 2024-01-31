const { Schema, model } = require('mongoose')

const User = new Schema({
    steam: { type: String, required: true },
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    activationLink: {type: String},
    isActivated: {type: Boolean, default: false}
})

module.exports = model('User', User)