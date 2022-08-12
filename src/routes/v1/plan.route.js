const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const planValidation = require('../../validations/plan.validation')
const planController = require('../../controllers/plan.controller')

const router = express.Router()

router
    .route('/')
    .post(auth(), validate(planValidation.createPlan), planController.createPlan)
    .get(auth(), validate(planValidation.getPlanPage), planController.getPlanPage)

router
    .route('/:planId')
    .get(auth(), validate(planValidation.getPlan), planController.getPlan)
    .put(auth(), validate(planValidation.updatePlan), planController.updatePlan)
    .delete(auth(), validate(planValidation.deletePlan), planController.deletePlan)

module.exports = router
