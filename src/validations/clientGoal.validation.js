const Joi = require('joi')
const { objectId } = require('./custom.validation')
const { STATUS_LIST } = require('../presets/clientGoal.preset')

const getClientGoal = {
    params: Joi.object().keys( {
        clientGoalId: Joi.string().custom(objectId),
    } ),
}

const getClientGoalsPage = {
    query: Joi.object().keys( {
        filter : Joi.string(),
        sortBy : Joi.string().allow(''),
        limit  : Joi.number().integer(),
        page   : Joi.number().integer(),
    } ),
}

const createClientGoal = {
    body: Joi.object().keys( {
        name       : Joi.string().required().trim(),
        status     : Joi.string().required().valid(...STATUS_LIST() ),
        start_date : Joi.date().required(),
        tasks      : Joi.array().items(Joi.object().keys( {
            completed   : Joi.boolean().default(false),
            description : Joi.string().required().trim(),
        } ) ),
        plan           : Joi.string().allow(null).custom(objectId),
        client         : Joi.string().required().custom(objectId),
        extra_sessions : Joi.array().items(Joi.object().keys( {
            subject : Joi.string().required().trim(),
            start   : Joi.string().required().trim(),
        } ) ).required(),
    } ),
}

const updateClientGoal = {
    params: Joi.object().keys( {
        clientGoalId: Joi.required().custom(objectId),
    } ),
    body: Joi.object().keys( {
        name       : Joi.string().required().trim(),
        status     : Joi.string().required().valid(...STATUS_LIST() ),
        start_date : Joi.date().required(),
        tasks      : Joi.array().items(Joi.object().keys( {
            completed   : Joi.boolean().default(false),
            description : Joi.string().required().trim(),
        } ) ),
        plan           : Joi.string().allow(null).custom(objectId),
        active         : Joi.boolean().default(false),
        client         : Joi.string().required().custom(objectId),
        extra_sessions : Joi.array().items(Joi.object().keys( {
            subject : Joi.string().required().trim(),
            start   : Joi.string().required().trim(),
        } ) ).required(),
    } ).unknown(true),
}

const deleteClientGoal = {
    params: Joi.object().keys( {
        clientGoalId: Joi.string().custom(objectId),
    } ),
}

const closeClientGoal = {
    params: Joi.object().keys( {
        clientGoalId: Joi.string().custom(objectId),
    } ),
}

module.exports = {
    getClientGoal,
    getClientGoalsPage,
    createClientGoal,
    updateClientGoal,
    deleteClientGoal,
    closeClientGoal,
}
