const express = require('express')
const { getTransactions, createTransactions } = require('../controllers/transactions')

const router = express.Router()

router.get('/', getTransactions)
router.post('/', createTransactions)

module.exports = router