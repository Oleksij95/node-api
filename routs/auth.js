const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const authMiddleware = require('../middlewares/auth')
const { body } = require("express-validator")

router.post('/registration', [
    body("email").isEmail(),
    body("password").isLength({min: 3, max: 32}),
], auth.registration)

router.post('/login', auth.login)

router.post('/logout', auth.logout)

router.get('/activate/:link', auth.activate)

router.get('/refresh', auth.refresh)

router.post('/forgot', auth.forgot)

router.post('/forgot/:token', auth.setNewPassword)

router.put('/user', authMiddleware, auth.getUser)


module.exports = router