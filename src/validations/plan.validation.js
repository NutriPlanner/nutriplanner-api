const Joi = require('joi')
const { objectId } = require('./custom.validation')

const getPlan = {
    params: Joi.object().keys( {
        planId: Joi.string().custom(objectId),
    } ),
}

const createPlan = {
    body: Joi.object().keys( {
        name        : Joi.string().required().trim().uppercase(),
        description : Joi.string().trim().allow(''),
        sessions    : Joi.array().items(Joi.object().keys( {
            subject : Joi.string().required().trim(),
            start   : Joi.string().required().trim(),
        } ) ).required(),
    } ),
}

const getPlanPage = {
    query: Joi.object().keys( {
        filter : Joi.string(),
        sortBy : Joi.string().allow(''),
        limit  : Joi.number().integer(),
        page   : Joi.number().integer(),
    } ),
}

const updatePlan = {
    params: Joi.object().keys( {
        planId: Joi.required().custom(objectId),
    } ),
    body: Joi.object().keys( {
        name        : Joi.string().required().trim().uppercase(),
        description : Joi.string().trim().allow(''),
        sessions    : Joi.array().items(Joi.object().keys( {
            subject : Joi.string().required().trim(),
            start   : Joi.string().required().trim(),
        } ) ).required(),
    } ).unknown(true),
}

const deletePlan = {
    params: Joi.object().keys( {
        planId: Joi.string().custom(objectId),
    } ),
}

module.exports = {
    getPlan,
    createPlan,
    getPlanPage,
    updatePlan,
    deletePlan,
}
