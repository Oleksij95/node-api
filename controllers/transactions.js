const transactionService = require('../service/transactions')

class Transactions {
    async getTransactions(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            const cartData = await transactionService.getTransactions(refreshToken)
            return res.json(cartData)
        } catch(e) {
            next(e)
        }
    }
    async createTransactions(req, res, next){
        try {
            const { refreshToken } = req.cookies;
            const { items, status, total } = req.body

            const cartData = await transactionService.setTransactions(refreshToken, items, status, total)
            return res.json(cartData)
        } catch(e) {
            next(e)
        }
    }
}


module.exports = new Transactions()