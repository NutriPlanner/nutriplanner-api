const dotenv = require('dotenv')
const path = require('path')
const Joi = require('joi')

dotenv.config( { path: path.join(__dirname, '../../.env') } )

const envVarsSchema = Joi.object()
    .keys( {
        NODE_ENV                              : Joi.string().valid('production', 'development', 'test').required(),
        PORT                                  : Joi.number().default(3000),
        MONGODB_URL                           : Joi.string().required().description('Mongo DB url'),
        JWT_SECRET                            : Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_HOURS           : Joi.number().default(16).description('hours after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS           : Joi.number().default(30).description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES : Joi.number()
            .default(10)
            .description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
            .default(10)
            .description('minutes after which verify email token expires'),
        SMTP_CLIENT_ID     : Joi.string().required().description('oauth2 client id for SMTP'),
        SMTP_CLIENT_SECRET : Joi.string().required(),
        SMTP_USERNAME      : Joi.string().required(),
        SMTP_REFRESH_TOKEN : Joi.string().required(),
    } )
    .unknown()

const { value: envVars, error } = envVarsSchema.prefs( { errors: { label: 'key' } } ).validate(process.env)

if (error)
    throw new Error(`Config validation error: ${error.message}`)


module.exports = {
    env      : envVars.NODE_ENV,
    port     : envVars.PORT,
    mongoose : {
        url     : envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options : {
            useNewUrlParser    : true,
            useUnifiedTopology : true,
        },
    },
    jwt: {
        secret                         : envVars.JWT_SECRET,
        accessExpirationHours          : envVars.JWT_ACCESS_EXPIRATION_HOURS,
        refreshExpirationDays          : envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes : envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes   : envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        oauth: {
            clientId     : envVars.SMTP_CLIENT_ID,
            clientSecret : envVars.SMTP_CLIENT_SECRET,
            redirectUrl  : 'https://developers.google.com/oauthplayground',
            user         : envVars.SMTP_USERNAME,
            refreshToken : envVars.SMTP_REFRESH_TOKEN,
        },
    },
}
