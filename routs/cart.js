const express = require('express')
const authMiddleware = require('../middlewares/auth')
const cart = require('../controllers/cart')

const cartRouter = express.Router()

cartRouter.get('/', authMiddleware, cart.getCart)

cartRouter.post('/', authMiddleware, cart.addToCart)

cartRouter.delete('/', authMiddleware, cart.clearCart)

cartRouter.post('/setCart', authMiddleware, cart.setCart)

cartRouter.delete('/:productId', authMiddleware, cart.removeFromCart)


module.exports = cartRouter
