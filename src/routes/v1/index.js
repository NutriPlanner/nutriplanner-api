const express = require('express')

// ROUTE IMPORT
const trackingRoute = require('./tracking.route')
const authRoute = require('./auth.route')
const userRoute = require('./user.route')
const clientRoute = require('./client.route')
const docsRoute = require('./docs.route')
const config = require('../../config/config')

const router = express.Router()

const defaultRoutes = [
    // ROUTE REGISTRATION
    {
        path  : '/tracking',
        route : trackingRoute,
    },

    {
        path  : '/auth',
        route : authRoute,
    },
    {
        path  : '/users',
        route : userRoute,
    },
    {
        path  : '/clients',
        route : clientRoute,
    },
]

const devRoutes = [
    // routes available only in development mode
    {
        path  : '/docs',
        route : docsRoute,
    },
]

defaultRoutes.forEach( (route) => {
    router.use(route.path, route.route)
} )

/* istanbul ignore next */
if (config.env === 'development') {
    devRoutes.forEach( (route) => {
        router.use(route.path, route.route)
    } )
}

module.exports = router
