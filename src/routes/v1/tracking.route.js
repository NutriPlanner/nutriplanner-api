const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const trackingValidation = require('../../validations/tracking.validation')
const trackingController = require('../../controllers/tracking.controller')

const router = express.Router()

router
    .route('/')
    .post(auth(), validate(trackingValidation.createTracking), trackingController.createTracking)
    .get(auth(), validate(trackingValidation.getTrackingPage), trackingController.getTrackingPage)

router
    .route('/:trackingId')
    .put(auth(), validate(trackingValidation.updateTracking), trackingController.updateTracking)
    .delete(auth(), validate(trackingValidation.deleteTracking), trackingController.deleteTracking)

module.exports = router
