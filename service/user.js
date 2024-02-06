const UserModel = require('../models/User')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const mailService = require('./mail')
const tokenService = require('./token')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')


class UserService { 

    async registration(email, password, steam, name, username ) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Email ${email} alredy exist`)
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()
        const user = await UserModel.create({email, password: hashPassword, steam, name, username})

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            user: userDto
        }
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.NotFound('User not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('*Your password or login is incorrect')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {

        if (!refreshToken) {
           throw ApiError.UnauthorizedError() 
        }
       
        const userData = tokenService.validateRefreshToken(refreshToken)

        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            user: userDto
        }

    }

    async updateUser (id, email, first_name, last_name) {
        const user = await UserModel.findById(id)
        if (!user) {
            throw ApiError.BadRequest('User not found')
        }
        
        await UserModel.updateOne(user, {email, first_name, last_name})
        const updatedUser = await UserModel.findById(id)

        const userDto = new UserDto(updatedUser);
        return {
            user: userDto
        }
    }

    async forgot(email) {
        const user = await UserModel.findOne({email: email})
        if (!user) {
            throw ApiError.NotFound('User not found')
        }
        const forgotLink = uuid.v4()

        await UserModel.updateOne(user, {forgotLink})

        await mailService.sendForgotmail(email, `${process.env.CLIENT_URL}/auth/forgot/${forgotLink}`)
        return {
            user
        }
    }

    async setNewPassword(newPassword, token) {

        const user = await UserModel.findOne({forgotLink: token})

        if (!user) {
            throw ApiError.NotFound('User not found')
        }

        const hashPassword = await bcrypt.hash(newPassword, 7)

        await UserModel.updateOne(user, {password: hashPassword, forgotLink: ''})

        return {
            user
        }
    }

    async checkForgotLink(token) {
        const user = await UserModel.findOne({forgotLink: token})

        if (!user) {
            throw ApiError.NotFound('User not found')
        }

        return {
            user
        }
    }
}

module.exports = new UserService()