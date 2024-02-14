const express = require('express')
const router = express.Router()

const productsRouter = require('./products')
const authRouter = require('./auth')
const cartRouter = require('./cart')
const contactsRouter = require('./contacts')

router.use('/auth', authRouter)
router.use('/products', productsRouter)
router.use('/cart', cartRouter)
router.use('/contacts', contactsRouter)


module.exports = router