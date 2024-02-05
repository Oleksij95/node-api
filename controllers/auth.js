const userService = require('../service/user')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')

class Auth {
    async registration(req, res, next) {
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const { email, password, steam, first_name, last_name } = req.body
            const userData = await userService.registration(email, password, steam, first_name, last_name)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "None", secure: true })
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
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "None", secure: true  })
            return res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
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
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true,  sameSite: "None", secure: true })
            return res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
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

    async getUser(req, res, next) {
        try {
            const {id, email, first_name, last_name} = req.body
            const users = await userService.updateUser(id, email, first_name, last_name)
            res.json(users)
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new Auth()