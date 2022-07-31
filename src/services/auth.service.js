const httpStatus = require('http-status')
const InternalCode = require('../utils/InternalCode')
const tokenService = require('./token.service')
const userService = require('./user.service')
const { Token } = require('../models')
const ApiError = require('../utils/ApiError')
const { tokenTypes } = require('../config/tokens')

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email)
    if (!user || !(await user.isPasswordMatch(password) ) ) {
        throw new ApiError( {
            statusCode   : httpStatus.UNAUTHORIZED,
            internalCode : InternalCode.AUTH__INVALID_CREDENTIALS,
            data         : {},
            message      : 'Incorrect email or password',
        } )
    }

    return user
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne( { token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false } )
    if (!refreshTokenDoc)
        throw new ApiError( { statusCode: httpStatus.NOT_FOUND, message: 'Not found' } )
  
    await refreshTokenDoc.remove()
}

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH)
        const user = await userService.getUserById(refreshTokenDoc.user)
        if (!user)
            throw new Error()
    
        await refreshTokenDoc.remove()

        return tokenService.generateAuthTokens(user)
    }
    catch (error) {
        throw new ApiError( { statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' } )
    }
}

/**
 * Reset password
 * @param {string} email
 * @param {string} code
 * @param {string} password
 * @returns {Promise}
 */
const resetPassword = async ( { email, code, password } ) => {
    try {
        const user = await userService.getUserByEmail(email)
        if (!user)
            throw new Error('User not found')
    

        await tokenService.verifyResetPasswordToken(code, user.id)

        await userService.updateUserById(user.id, { password } )
        await Token.deleteMany( { user: user.id, type: tokenTypes.RESET_PASSWORD } )
    }
    catch (error) {
        throw new ApiError( {
            statusCode   : httpStatus.UNAUTHORIZED,
            message      : 'Password reset failed',
            internalCode : InternalCode.AUTH__PASSWORD_RESET_FAILED,
        } )
    }
}

module.exports = {
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
}
