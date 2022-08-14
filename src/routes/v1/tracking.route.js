const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { LICENSEE } = require('../../config/licensees')
const trackingValidation = require('../../validations/tracking.validation')
const trackingController = require('../../controllers/tracking.controller')

const router = express.Router()

router
    .route('/')
    .get(auth(), validate(trackingValidation.getTrackingPage), trackingController.getTrackingPage)
    .post(auth(), validate(trackingValidation.createTracking), trackingController.createTracking)

router
    .route('/pendings')
    .get(auth( { licensee: LICENSEE.PRO } ), validate(trackingValidation.getTrackingPage), trackingController.getPendingTrackingPage)

router
    .route('/:trackingId')
    .get(auth(), validate(trackingValidation.getTracking), trackingController.getTracking)
    .put(auth(), validate(trackingValidation.updateTracking), trackingController.updateTracking)
    .delete(auth(), validate(trackingValidation.deleteTracking), trackingController.deleteTracking)

module.exports = router
