const CartModel = require('../models/Cart')
const UserModel = require('../models/User')
const ProductModel = require("../models/Product")
const tokenService = require('./token')
const ApiError = require('../exceptions/api-error')
const ProductDto = require('../dtos/product-dto')

class CartService {

    async getCart (email) {

        const user = await UserModel.findOne({email})
        
        if (!user) {
            throw ApiError.BadRequest('User not found')
        }   

        const cart = await CartModel.findOne({user: user._id})

        if (!cart) {
            throw ApiError.NotFound('Cart not found')
        }

        let totalCount = 0
        let totalPrice = 0;

        cart.items.map((count) => {
            totalCount += count.quantity
            totalPrice += count.product.price * count.quantity
        })

        cart.totalCount = totalCount
        cart.totalPrice = totalPrice
       
        await cart.save();

        return {
            cart
        }
    }

    async addToCart(refreshToken, productId, quantity ) {

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const product = await ProductModel.findById(productId)

        if (!product) {
            throw ApiError.NotFound(`Product ${productId} not found`)
        }
    
        let cart = await CartModel.findOne({user: user.id})
        
        if (!cart) {
            cart = await CartModel.create({ user: user.id, items: [] })
        }
        
        const existingItem = cart.items.find(item => {
            return item.product.id === productId
        })

        const productDto = new ProductDto(product)

        if (!existingItem || existingItem === undefined) {
            cart.items.push({ product: productDto, quantity });
            cart.totalCount += quantity
            cart.totalPrice += productDto.price
        }
        
        await cart.save();

        return {
            cart
        }
    }

    async removeFromCart(refreshToken, productId, deleneOne) {

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const product = await ProductModel.findById(productId)

        if (!product) {
            throw ApiError.NotFound(`Product ${productId} not found`)
        }
    
        let cart = await CartModel.findOne({user: user.id})
        
        if (!cart) {
            throw ApiError.NotFound('Cart not found')
        }   
        
        if (deleneOne) {
            const itemIndex = cart.items.findIndex(item => item.product.id === productId);
            if (itemIndex !== -1) {
                cart.items[itemIndex].quantity--;
                if (cart.items[itemIndex].quantity === 0) {
                    cart.items.splice(itemIndex, 1);
                }
            }
        } else {
            cart.items = cart.items.filter(item => item.product.id !== productId);
        }

        let totalCount = 0
        let totalPrice = 0

        if(cart.items.length > 0) {
            cart.items.map((item) => {
                totalCount += item.quantity
                totalPrice += item.quantity * item.product.price
            })
            cart.totalCount = totalCount
            cart.totalPrice = totalPrice
        } else {
            cart.totalCount = 0
            cart.totalPrice = 0
        }

        await cart.save();

        return {
            cart
        }
    }

    async setCart(refreshToken, products) {

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)

        let cart = await CartModel.findOne({user: user.id})

        if (!cart || cart === null) {
            cart = await CartModel.create({ user: user.id, items: [] })
        }

        for (let i = 0; i < products.length; i++) {
                        
            const product = await ProductModel.findById(products[i].product.id)

            if (!product) {
                throw ApiError.NotFound(`Product ${productId} not found`)
            }

            const productDto = new ProductDto(product)

            const existingItem = cart.items.find(itemP => {
                return itemP.product.id === products[i].product.id
            })

            if (existingItem === undefined) {
                cart.items.push({ product: productDto, quantity: 1 });
                cart.totalPrice += productDto.price
            }
        }

        await cart.save();
    
        return cart
    }
    
}

module.exports = new CartService()