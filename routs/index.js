const express = require('express')
const router = express.Router()

const productsRouter = require('./products')
const authRouter = require('./auth')
const cartRouter = require('./cart')

router.use('/auth', authRouter)
router.use('/products', productsRouter)
router.use('/cart', cartRouter)


module.exports = router