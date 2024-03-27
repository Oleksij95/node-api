const TransactionModel = require('../models/Transaction')
const UserModel = require('../models/User')
const tokenService = require('./token')
const ApiError = require('../exceptions/api-error')


class TransactionsService {
    async getTransactions (refreshToken) {

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        let transaction = []

        if (!userData || !tokenFromDb) {
            return {
                transaction
            }
        }

        const user = await UserModel.findById(userData.id)

        transaction = await TransactionModel.find({user: user._id})

        return {
            transaction
        }

    }

    async setTransactions (refreshToken, items, status, total) {

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)

        const transaction = await TransactionModel.create({ user: user.id, items, status, total })
        await transaction.save();

        return {
            transaction
        }
    }

}

module.exports = new TransactionsService()