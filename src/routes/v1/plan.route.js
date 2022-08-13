const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { LICENSEE } = require('../../config/licensees')
const planValidation = require('../../validations/plan.validation')
const planController = require('../../controllers/plan.controller')

const router = express.Router()

router
    .route('/')
    .post(auth( { licensee: LICENSEE.PRO } ), validate(planValidation.createPlan), planController.createPlan)
    .get(auth( { licensee: LICENSEE.PRO } ), validate(planValidation.getPlanPage), planController.getPlanPage)

router
    .route('/:planId')
    .get(auth( { licensee: LICENSEE.PRO } ), validate(planValidation.getPlan), planController.getPlan)
    .put(auth( { licensee: LICENSEE.PRO } ), validate(planValidation.updatePlan), planController.updatePlan)
    .delete(auth( { licensee: LICENSEE.PRO } ), validate(planValidation.deletePlan), planController.deletePlan)

module.exports = router
