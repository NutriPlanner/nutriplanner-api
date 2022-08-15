const mongoose = require('mongoose')
const moment = require('moment')
const httpStatus = require('http-status')
const InternalCode = require('../utils/InternalCode')
const { ClientGoal } = require('../models')
const ApiError = require('../utils/ApiError')
const trackingService = require('../services/tracking.service')
const planService = require('../services/plan.service')
const clientService = require('../services/client.service')
const { session } = require('passport')

/**
 * Get clientGoal by id
 * @param {ObjectId} id
 * @returns {Promise<ClientGoal>}
 */
const getClientGoalById = async (id, session) => await ClientGoal().findById(id).session(session)

/**
 * Query for clientGoals page
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClientGoalsPage = async (filter, options) => {
    const clientGoalsPage = await ClientGoal().paginate(JSON.parse(filter), options)

    return clientGoalsPage
}

/**
 * Create a clientGoal
 * @param {Object} data
 * @returns {Promise<ClientGoal>}
 */
const createClientGoal = async (data) => {
    if (await ClientGoal().existsOneActive(data.client)) {
        throw new ApiError( {
            statusCode   : httpStatus.BAD_REQUEST,
            internalCode : InternalCode.CLIENT_GOAL__EXISTS_ONE_ACTIVE,
            data         : {},
            message      : 'Client goal active already exists',
        } )
    }

    const client = await clientService.getClientById(data.client)
    if (!client) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.CLIENT__NOT_FOUND,
            data         : { id: data.client },
            message      : 'Client not found',
        } )
    }

    const plan = data.plan ? await planService.getPlanById(data.plan) : null
    if (!plan && data.plan) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.PLAN__NOT_FOUND,
            data         : { id: data.plan },
            message      : 'Plan not found',
        } )
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const newClientGoal = await ClientGoal().create( [{
        name       : data.name,
        status     : data.status,
        start_date : moment(data.start_date).utc().toISOString(),
        tasks      : data.tasks,
        plan       : plan ? plan.name : null,
        client     : data.client,
        active     : true,
    }], { session } )

    try {
        await trackingService.incrementTrackings( {
            client        : newClientGoal[0].client,
            extraSessions : [ ...(plan ? plan.sessions : [] ), ...data.extra_sessions ],
            goal          : newClientGoal[0].id,
            startDate     : newClientGoal[0].start_date,
        }, { session } )
    }
    catch (error) {
        await session.abortTransaction()
        await session.endSession()

        throw error
    }

    await session.commitTransaction()
    await session.endSession()
        
    return newClientGoal[0]
}

/**
 * Update clientGoal by id
 * @param {ObjectId} id
 * @param {Object} data
 * @returns {Promise<ClientsGoals>}
 */
const updateClientGoalById = async (id, data) => {
    const client = await clientService.getClientById(data.client)
    if (!client) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.CLIENT__NOT_FOUND,
            data         : { id: data.client },
            message      : 'Client not found',
        } )
    }
    
    const session = await mongoose.startSession()
    session.startTransaction()

    // this have to be after session. Session will be injected for .save() later
    const clientGoal = await getClientGoalById(id, session)
    if (!clientGoal || !clientGoal.active) {
        await session.abortTransaction()
        await session.endSession()

        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.CLIENT_GOAL__UPDATE__NOT_FOUND,
            data         : { id },
            message      : 'Goal not found',
        } )
    }

    try {
        await trackingService.incrementTrackings( {
            client        : data.client,
            extraSessions : data.extra_sessions,
            goal          : data.id,
            startDate     : data.start_date,
        }, { session } )
    }
    catch (error) {
        await session.abortTransaction()
        await session.endSession()

        throw error
    }

    const newClientGoal = {
        name   : data.name,
        status : data.status,
        tasks  : data.tasks,
    }

    Object.assign(clientGoal, newClientGoal)

    await clientGoal.save()

    await session.commitTransaction()
    await session.endSession()

    return clientGoal
}

/**
 * Delete clientGoal by id
 * @param {ObjectId} clientGoalId
 * @returns {Promise<ClientsGoals>}
 */
const deleteClientGoalById = async (clientGoalId) => {
    const clientGoal = await getClientGoalById(clientGoalId)
    if (!clientGoal) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.CLIENT_GOAL__DELETE__NOT_FOUND,
            data         : { id: clientGoalId },
            message      : 'ClientsGoals not found',
        } )
    }
    await clientGoal.remove()

    return clientGoal
}

const closeClientGoal = async (id) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const clientGoal = await getClientGoalById(id, session)
        if (!clientGoal) {
            throw new ApiError( {
                statusCode   : httpStatus.NOT_FOUND,
                internalCode : InternalCode.CLIENT_GOAL__CLOSE__NOT_FOUND,
                data         : { id },
                message      : 'ClientsGoals not found',
            } )
        }

        // change tracking status to closed for all after today
        const today = moment().utc().toISOString()
        await trackingService.closeTrackings( {
            goal  : clientGoal.id,
            after : today,
        }, { session } )

        clientGoal.active = false
        await clientGoal.save()

        await session.commitTransaction()
        await session.endSession()
    }
    catch (error) {
        session.abortTransaction()
        session.endSession()
        throw error
    }
}

module.exports = {
    getClientGoalById,
    queryClientGoalsPage,
    createClientGoal,
    updateClientGoalById,
    deleteClientGoalById,
    closeClientGoal,
}
