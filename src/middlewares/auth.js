/* eslint-disable security/detect-object-injection */
const passport = require('passport')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const InternalCode = require('../utils/InternalCode')
const { roleRights } = require('../config/roles')
const { LICENSEE, licenseeProps } = require('../config/licensees')

const verifyCallback = (req, resolve, reject, { requiredRights = [], licensee } ) => async (err, user, info) => {
    if (err || info || !user)
        return reject(new ApiError( { statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' } ))

    req.user = user

    if (!user.isActivated) {
        return reject(new ApiError( {
            statusCode   : httpStatus.UNAUTHORIZED,
            internalCode : InternalCode.AUTH__INACTIVE_ACCOUNT,
            data         : {},
            message      : 'User is inactive',
        } ))
    }

    if (requiredRights.length) {
        const userRights = roleRights.get(user.role)
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight))
        if (!hasRequiredRights && req.params.userId !== user.id)
            return reject(new ApiError( { statusCode: httpStatus.FORBIDDEN, message: 'Forbidden' } ))
    }

    const requiredLicensee = licensee || LICENSEE.BASIC
    const requiredLicenseeProps = licenseeProps.get(requiredLicensee)
    const userLicenseeProps = licenseeProps.get(user.licensee || LICENSEE.BASIC)

    if (requiredLicenseeProps.priority > userLicenseeProps.priority) {
        return reject(new ApiError( {
            statusCode   : httpStatus.FORBIDDEN,
            message      : 'Forbidden',
            internalCode : InternalCode.AUTH__LOWER_LICENSEE,
            data         : { required: requiredLicensee },
        } ))
    }

    resolve()
}

const auth = ( { requiredRights, licensee } = {} ) => async (req, res, next) => new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, { requiredRights, licensee } ))(req, res, next)
} )
    .then(() => next())
    .catch((err) => next(err))

module.exports = auth
