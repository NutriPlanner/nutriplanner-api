const Joi = require('joi')
const { objectId } = require('./custom.validation')

const createClient = {
    body: Joi.object().keys( {
        name      : Joi.string().required(),
        last_name : Joi.string().required(),
        dni       : Joi.string(),
        birthday  : Joi.string(),
        address   : Joi.string(),
        phone     : Joi.string(),
        email     : Joi.string(),
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
        name      : Joi.string().required(),
        last_name : Joi.string().required(),
        dni       : Joi.string(),
        birthday  : Joi.string(),
        address   : Joi.string(),
        phone     : Joi.string(),
        email     : Joi.string(),
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
