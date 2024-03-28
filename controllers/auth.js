const userService = require('../service/user')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')

const cookie = require('cookie');

class Auth {
    async registration(req, res, next) {
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const { email, password, steam, name, username } = req.body
            const userData = await userService.registration(email, password, steam, name, username)
            res.setHeader('Set-Cookie', cookie.serialize('refreshToken', String(userData.refreshToken), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "None",
                secure: true,
                partitioned: true,
                path: '/'
              }));
            return res.json(userData)
        } catch(e) {
            next(e)
            // res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password )

            res.setHeader('Set-Cookie', cookie.serialize('refreshToken', String(userData.refreshToken), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "None",
                secure: true,
                partitioned: true,
                path: '/'
              }));

            // res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "None", secure: true, partitioned: true  })
            return res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
            res.setHeader('Set-Cookie', cookie.serialize('refreshToken', String(''), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "None",
                secure: true,
                partitioned: true,
                path: '/'
              }));
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch(e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.setHeader('Set-Cookie', cookie.serialize('refreshToken', String(userData.refreshToken), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "None",
                secure: true,
                partitioned: true,
                path: '/'
              }));
            return res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async forgot(req, res, next) {
        try {
            const { email } = req.body
            const forgotData = await userService.forgot(email)
            return res.json(forgotData) 
        } catch(e) {
            next(e)
        }
    }

    async setNewPassword(req, res, next){
        try {
            const { token } = req.params;
            const { newPassword } = req.body
            const forgotData = await userService.setNewPassword(newPassword, token)
            return res.json(forgotData) 
        } catch(e) {
            next(e)
        }
    }

    async checkForgotLink(req, res, next) {
        try {
            const { token } = req.params;
            const forgotData = await userService.checkForgotLink(token)
            return res.json(forgotData) 
        } catch(e) {
            next(e)
        }
    }

    async getUser(req, res, next) {
        try {
            const {id, email, name, username, steam, tradeLink} = req.body
            const users = await userService.updateUser(id, email, name, username, steam, tradeLink)
            res.json(users)
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new Auth()