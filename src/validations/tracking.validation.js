const Joi = require('joi')
const { objectId } = require('./custom.validation')
const { STATUS_LIST } = require('../presets/tracking.preset')

const getTracking = {
    params: Joi.object().keys( {
        trackingId: Joi.string().custom(objectId),
    } ),
}

const createTracking = {
    body: Joi.object().keys( {
        measurement: Joi.object().keys( {
            chest     : Joi.string().allow(''),
            arm       : Joi.string().allow(''),
            stomach   : Joi.string().allow(''),
            waist     : Joi.string().allow(''),
            thigh     : Joi.string().allow(''),
            bottom    : Joi.string().allow(''),
            body_mass : Joi.string().allow(''),
        } ),
        status  : Joi.string().valid(...STATUS_LIST() ),
        client  : Joi.required().custom(objectId),
        subject : Joi.string().required(),
        note    : Joi.string().allow(''),
    } ),
}

const getTrackingPage = {
    query: Joi.object().keys( {
        filter : Joi.string(),
        sortBy : Joi.string().allow(''),
        limit  : Joi.number().integer(),
        page   : Joi.number().integer(),
    } ),
}

const updateTracking = {
    params: Joi.object().keys( {
        trackingId: Joi.required().custom(objectId),
    } ),
    body: Joi.object().keys( {
        measurement: Joi.object().keys( {
            chest     : Joi.string().allow(''),
            arm       : Joi.string().allow(''),
            stomach   : Joi.string().allow(''),
            waist     : Joi.string().allow(''),
            thigh     : Joi.string().allow(''),
            bottom    : Joi.string().allow(''),
            body_mass : Joi.string().allow(''),
        } ),
        status  : Joi.string().valid(...STATUS_LIST() ),
        client  : Joi.required().custom(objectId),
        subject : Joi.string().required(),
        note    : Joi.string().allow(''),
        date    : [
            Joi.string().allow(''),
            Joi.date(),
        ],
    } ).unknown(true),
}

const deleteTracking = {
    params: Joi.object().keys( {
        trackingId: Joi.string().custom(objectId),
    } ),
}

module.exports = {
    getTracking,
    createTracking,
    getTrackingPage,
    updateTracking,
    deleteTracking,
}
