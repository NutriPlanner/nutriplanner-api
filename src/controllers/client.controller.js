const httpStatus = require('http-status')
const pick = require('../utils/pick')
const catchAsync = require('../utils/catchAsync')
const { clientService } = require('../services')

const createClient = catchAsync(async (req, res) => {
    const client = await clientService.createClient( {
        ...req.body,
        tenant: req.user._id,
    } )
    res.status(httpStatus.CREATED).send(client)
} )

const getClients = catchAsync(async (req, res) => {
    const filter = req.query.filter || '{}'
    const options = pick(req.query, [ 'sortBy', 'limit', 'page' ] )
    const result = await clientService.queryClients(filter, options)
    res.send(result)
} )

const updateClient = catchAsync(async (req, res) => {
    const client = await clientService.updateClientById(req.params.clientId, req.body)
    res.send(client)
} )

const deleteClient = catchAsync(async (req, res) => {
    await clientService.deleteClientById(req.params.clientId)
    res.status(httpStatus.NO_CONTENT).send()
} )

module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient,
}
