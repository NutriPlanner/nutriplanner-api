const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const clientValidation = require('../../validations/client.validation');
const clientController = require('../../controllers/client.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(clientValidation.createClient), clientController.createClient)
  .get(auth(), validate(clientValidation.getClients), clientController.getClients);

router
  .route('/:clientId')
  .put(auth(), validate(clientValidation.updateClient), clientController.updateClient)
  .delete(auth(), validate(clientValidation.deleteClient), clientController.deleteClient);

module.exports = router;
