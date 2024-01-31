const UserModel = require('../models/User')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const mailService = require('./mail')
const tokenService = require('./token')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')


class UserService { 
    async registration(email, password, steam, first_name, last_name ) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Email ${email} alredy exist`)
        }
        const hashPassword = await bcrypt.hash(password, 7)
        const activationLink = uuid.v4()
        const user = await UserModel.create({email, password: hashPassword, steam, first_name, last_name, activationLink})

        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`)


        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return {
            ...tokens,
            user: userDto
        }
    }

    async activate (activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Actavation link is broken')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('User not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Bed password ')
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
}

module.exports = new UserService()