const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const clientsGoalsValidation = require('../../validations/clientGoal.validation')
const clientsGoalsController = require('../../controllers/clientsGoals.controller')

const router = express.Router()

router
    .route('/')
    .post(auth(), validate(clientsGoalsValidation.createClientGoal), clientsGoalsController.createClientGoal)
    .get(auth(), validate(clientsGoalsValidation.getClientGoalsPage), clientsGoalsController.getClientGoalsPage)

router
    .route('/:clientGoalId')
    .get(auth(), validate(clientsGoalsValidation.getClientGoal), clientsGoalsController.getClientGoal)
    .put(auth(), validate(clientsGoalsValidation.updateClientGoal), clientsGoalsController.updateClientGoal)
    .delete(auth(), validate(clientsGoalsValidation.deleteClientGoal), clientsGoalsController.deleteClientGoal)

router
    .route('/close/:clientGoalId')
    .put(auth(), validate(clientsGoalsValidation.closeClientGoal), clientsGoalsController.closeClientGoal)

module.exports = router
