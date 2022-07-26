const httpStatus = require('http-status')
const InternalCode = require('../utils/InternalCode')
const { Client } = require('../models')
const ApiError = require('../utils/ApiError')

/**
 * Create a client
 * @param {Object} clientBody
 * @returns {Promise<Client>}
 */
const createClient = async (clientBody) => {
    return Client().create(clientBody)
}

/**
 * Query for clients
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClients = async (filter, options) => {
    const clients = await Client().paginate(JSON.parse(filter), options)

    return clients
}

/**
 * Get client by id
 * @param {ObjectId} id
 * @returns {Promise<Client>}
 */
const getClientById = async (id) => Client().findById(id)

/**
 * Update client by id
 * @param {ObjectId} clientId
 * @param {Object} updateBody
 * @returns {Promise<Client>}
 */
const updateClientById = async (clientId, updateBody) => {
    const client = await getClientById(clientId)
    if (!client) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.CLIENT__UPDATE__NOT_FOUND,
            data         : { id: clientId },
            message      : 'Client not found',
        } )
    }

    Object.assign(client, updateBody)

    await client.save()

    return client
}

/**
 * Delete client by id
 * @param {ObjectId} clientId
 * @returns {Promise<Client>}
 */
const deleteClientById = async (clientId) => {
    const client = await getClientById(clientId)
    if (!client) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.CLIENT__DELETE__NOT_FOUND,
            data         : { id: clientId },
            message      : 'Client not found',
        } )
    }
    await client.remove()

    return client
}

module.exports = {
    createClient,
    queryClients,
    getClientById,
    updateClientById,
    deleteClientById,
}
