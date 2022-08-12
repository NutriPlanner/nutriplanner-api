const httpStatus = require('http-status')
const pick = require('../utils/pick')
const catchAsync = require('../utils/catchAsync')
const { clientGoalService } = require('../services')

const getClientGoal = catchAsync(async (req, res) => {
    const result = await clientGoalService.getClientGoalById(req.params.clientGoalId)
    res.send(result)
} )

const getClientGoalsPage = catchAsync(async (req, res) => {
    const filter = req.query.filter || '{}'
    const options = pick(req.query, [ 'sortBy', 'limit', 'page' ] )
    const result = await clientGoalService.queryClientGoalsPage(filter, options)
    res.send(result)
} )

const createClientGoal = catchAsync(async (req, res) => {
    const clientGoal = await clientGoalService.createClientGoal(req.body)
    res.status(httpStatus.CREATED).send(clientGoal)
} )

const updateClientGoal = catchAsync(async (req, res) => {
    const clientGoal = await clientGoalService.updateClientGoalById(req.params.clientGoalId, req.body)
    res.send(clientGoal)
} )

const deleteClientGoal = catchAsync(async (req, res) => {
    await clientGoalService.deleteClientGoalById(req.params.clientGoalId)
    res.status(httpStatus.NO_CONTENT).send()
} )

const closeClientGoal = catchAsync(async (req, res) => {
    await clientGoalService.closeClientGoal(req.params.clientGoalId)
    res.status(httpStatus.NO_CONTENT).send()
} )

module.exports = {
    getClientGoal,
    getClientGoalsPage,
    createClientGoal,
    updateClientGoal,
    deleteClientGoal,
    closeClientGoal,
}
