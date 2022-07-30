const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { STATUS_LIST } = require('../presets/tracking.preset');

const createTracking = {
  body: Joi.object().keys({
    measurement: Joi.object().keys({
      chest: Joi.string(),
      arm: Joi.string(),
      stomach: Joi.string(),
      waist: Joi.string(),
      thigh: Joi.string(),
      bottom: Joi.string(),
      body_mass: Joi.string(),
    }),
    status: Joi.string().valid(...STATUS_LIST()),
    client: Joi.required().custom(objectId),
    date: Joi.date().required(),
    subject: Joi.string().required(),
    note: Joi.string(),
  }),
};

const getTrackingPage = {
  query: Joi.object().keys({
    filter: Joi.string(),
    sortBy: Joi.string().allow(''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateTracking = {
  params: Joi.object().keys({
    trackingId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    measurement: Joi.object().keys({
      chest: Joi.string(),
      arm: Joi.string(),
      stomach: Joi.string(),
      waist: Joi.string(),
      thigh: Joi.string(),
      bottom: Joi.string(),
      body_mass: Joi.string(),
    }),
    status: Joi.string().valid(...STATUS_LIST()),
    client: Joi.required().custom(objectId),
    date: Joi.date().required(),
    subject: Joi.string().required(),
    note: Joi.string(),
  }),
};

const deleteTracking = {
  params: Joi.object().keys({
    trackingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTracking,
  getTrackingPage,
  updateTracking,
  deleteTracking,
};
