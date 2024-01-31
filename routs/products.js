const express = require('express')
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/products')

const router = express.Router()

router.get('/', getProducts)

router.post('/', createProduct)

router.put('/:productId', updateProduct)

router.delete('/', deleteProduct)

router.get('/:productId', getProductById)

module.exports = router