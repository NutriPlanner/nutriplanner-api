const express = require('express')

// ROUTE IMPORT
const clientGoalRoute = require('./clientGoal.route')
const planRoute = require('./plan.route')
const trackingRoute = require('./tracking.route')
const clientRoute = require('./client.route')
const userRoute = require('./user.route')
const authRoute = require('./auth.route')
const docsRoute = require('./docs.route')
const config = require('../../config/config')

const router = express.Router()

const defaultRoutes = [
    // ROUTE REGISTRATION
    {
        path  : '/clientGoals',
        route : clientGoalRoute,
    },
    {
        path  : '/plans',
        route : planRoute,
    },
    {
        path  : '/trackings',
        route : trackingRoute,
    },
    {
        path  : '/clients',
        route : clientRoute,
    },
    {
        path  : '/users',
        route : userRoute,
    },
    {
        path  : '/auth',
        route : authRoute,
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
