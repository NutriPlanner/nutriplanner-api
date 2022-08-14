const Joi = require('joi')
const { objectId, rut } = require('./custom.validation')

const createClient = {
    body: Joi.object().keys( {
        herba_id  : Joi.string().allow(''),
        name      : Joi.string().required(),
        last_name : Joi.string().required(),
        rut       : Joi.string().custom(rut).required(),
        birthday  : Joi.string().required(),
        address   : Joi.string().required(),
        phone     : Joi.string().required(),
        email     : Joi.string().required(),
    } ).unknown(true),
}

const getClients = {
    query: Joi.object().keys( {
        filter : Joi.string(),
        sortBy : Joi.string().allow(''),
        limit  : Joi.number().integer(),
        page   : Joi.number().integer(),
    } ),
}

const getClient = {
    params: Joi.object().keys( {
        clientId: Joi.string().custom(objectId),
    } ),
}

const updateClient = {
    params: Joi.object().keys( {
        clientId: Joi.required().custom(objectId),
    } ),
    body: Joi.object().keys( {
        herba_id  : Joi.string().allow(''),
        name      : Joi.string().required(),
        last_name : Joi.string().required(),
        rut       : Joi.string().custom(rut).required(),
        birthday  : Joi.string().required(),
        address   : Joi.string().required(),
        phone     : Joi.string().required(),
        email     : Joi.string().required(),
    } ).unknown(true),
}

const deleteClient = {
    params: Joi.object().keys( {
        clientId: Joi.string().custom(objectId),
    } ),
}

module.exports = {
    createClient,
    getClient,
    getClients,
    updateClient,
    deleteClient,
}
