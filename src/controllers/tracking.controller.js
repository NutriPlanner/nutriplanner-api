const httpStatus = require('http-status')
const pick = require('../utils/pick')
const catchAsync = require('../utils/catchAsync')
const { trackingService } = require('../services')

const getTracking = catchAsync(async (req, res) => {
    const result = await trackingService.getTrackingById(req.params.trackingId)
    res.send(result)
} )

const createTracking = catchAsync(async (req, res) => {
    const tracking = await trackingService.createTracking(req.body)
    res.status(httpStatus.CREATED).send(tracking)
} )

const getTrackingPage = catchAsync(async (req, res) => {
    const filter = req.query.filter || '{}'
    const options = pick(req.query, [ 'sortBy', 'limit', 'page' ] )
    const result = await trackingService.queryTrackingPage(filter, options)
    res.send(result)
} )

const updateTracking = catchAsync(async (req, res) => {
    const tracking = await trackingService.updateTrackingById(req.params.trackingId, req.body)
    res.send(tracking)
} )

const deleteTracking = catchAsync(async (req, res) => {
    await trackingService.deleteTrackingById(req.params.trackingId)
    res.status(httpStatus.NO_CONTENT).send()
} )

module.exports = {
    getTracking,
    createTracking,
    getTrackingPage,
    updateTracking,
    deleteTracking,
}
