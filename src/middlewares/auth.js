const passport = require('passport')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const { roleRights } = require('../config/roles')

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user)
        return reject(new ApiError( { statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' } ) )
  
    req.user = user

    if (requiredRights.length) {
        const userRights = roleRights.get(user.role)
        const hasRequiredRights = requiredRights.every( (requiredRight) => userRights.includes(requiredRight) )
        if (!hasRequiredRights && req.params.userId !== user.id)
            return reject(new ApiError( { statusCode: httpStatus.FORBIDDEN, message: 'Forbidden' } ) )
    }

    resolve()
}

const auth = (...requiredRights) => async (req, res, next) => new Promise( (resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights) )(req, res, next)
} )
    .then( () => next() )
    .catch( (err) => next(err) )

module.exports = auth
