const httpStatus = require('http-status')
const pick = require('../utils/pick')
const catchAsync = require('../utils/catchAsync')
const { planService } = require('../services')

const getPlan = catchAsync(async (req, res) => {
    const result = await planService.getPlanById(req.params.planId)
    res.send(result)
} )

const getPlanPage = catchAsync(async (req, res) => {
    const filter = req.query.filter || '{}'
    const options = pick(req.query, [ 'sortBy', 'limit', 'page' ] )
    const result = await planService.queryPlanPage(filter, options)
    res.send(result)
} )

const createPlan = catchAsync(async (req, res) => {
    const plan = await planService.createPlan(req.body)
    res.status(httpStatus.CREATED).send(plan)
} )

const updatePlan = catchAsync(async (req, res) => {
    const plan = await planService.updatePlanById(req.params.planId, req.body)
    res.send(plan)
} )

const deletePlan = catchAsync(async (req, res) => {
    await planService.deletePlanById(req.params.planId)
    res.status(httpStatus.NO_CONTENT).send()
} )

module.exports = {
    getPlan,
    createPlan,
    getPlanPage,
    updatePlan,
    deletePlan,
}
