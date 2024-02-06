const { Schema, model } = require('mongoose')

const User = new Schema({
    steam: { type: String, required: true },
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    forgotLink: {type: String},
})

module.exports = model('User', User)