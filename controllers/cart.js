const cartService = require('../service/cart')
const ApiError = require('../exceptions/api-error')

class Cart {
    async getCart(req, res, next){
        try {
            const userEmail = req.user.email;
            const cartData = await cartService.getCart(userEmail)
            return res.json(cartData)
        } catch(e) {
            next(e)
        }
    }

    async clearCart(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            const cartData = await cartService.clearCart(refreshToken)
            return res.json(cartData)
        } catch(e) {
            next(e)
        }
    }

    async addToCart (req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const {  productId, quantity } = req.body
            const cartData = await cartService.addToCart(refreshToken,  productId, quantity)
            res.json(cartData)
        } catch(e) {
            next(e)
        }
    }

    async removeFromCart(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { productId } = req.params;
            let { deleneOne } = req.query
            const cartData = await cartService.removeFromCart(refreshToken,  productId, deleneOne)
            res.json(cartData)
        } catch(e) {
            next(e)
        }
    }

    async setCart(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const products = req.body;
            const cartData = await cartService.setCart(refreshToken,  products)
            res.json(cartData)
        } catch(e) {
            next(e)
        }
    }

    
}

module.exports = new Cart()