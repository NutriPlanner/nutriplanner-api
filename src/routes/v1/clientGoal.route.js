const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { LICENSEE } = require('../../config/licensees')
const clientsGoalsValidation = require('../../validations/clientGoal.validation')
const clientsGoalsController = require('../../controllers/clientsGoals.controller')

const router = express.Router()

router
    .route('/')
    .post(auth( { licensee: LICENSEE.PRO } ), validate(clientsGoalsValidation.createClientGoal), clientsGoalsController.createClientGoal)
    .get(auth( { licensee: LICENSEE.PRO } ), validate(clientsGoalsValidation.getClientGoalsPage), clientsGoalsController.getClientGoalsPage)

router
    .route('/:clientGoalId')
    .get(auth( { licensee: LICENSEE.PRO } ), validate(clientsGoalsValidation.getClientGoal), clientsGoalsController.getClientGoal)
    .put(auth( { licensee: LICENSEE.PRO } ), validate(clientsGoalsValidation.updateClientGoal), clientsGoalsController.updateClientGoal)
    .delete(auth( { licensee: LICENSEE.PRO } ), validate(clientsGoalsValidation.deleteClientGoal), clientsGoalsController.deleteClientGoal)

router
    .route('/close/:clientGoalId')
    .put(auth( { licensee: LICENSEE.PRO } ), validate(clientsGoalsValidation.closeClientGoal), clientsGoalsController.closeClientGoal)

module.exports = router
