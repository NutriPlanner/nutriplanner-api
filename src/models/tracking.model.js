const mongoose = require('mongoose');
const { STATUS, STATUS_LIST } = require('../presets/tracking.preset');
const { toJSON, paginate } = require('./plugins');

const measurementSchema = mongoose.Schema({
  chest: {
    type: String,
    required: false,
    trim: true,
  },
  arm: {
    type: String,
    required: false,
    trim: true,
  },
  stomach: {
    type: String,
    required: false,
    trim: true,
  },
  waist: {
    type: String,
    required: false,
    trim: true,
  },
  thigh: {
    type: String,
    required: false,
    trim: true,
  },
  bottom: {
    type: String,
    required: false,
    trim: true,
  },
  body_mass: {
    type: String,
    required: false,
    trim: true,
  },
});

const trackingSchema = mongoose.Schema(
  {
    measurement: measurementSchema,
    status: {
      type: String,
      required: false,
      enum: [...STATUS_LIST()],
      default: STATUS.PENDING,
    },
    date: {
      type: Date,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      required: false,
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
trackingSchema.plugin(toJSON);
trackingSchema.plugin(paginate);

/**
 * @typedef Tracking
 */
const Tracking = mongoose.model('Tracking', trackingSchema);

module.exports = Tracking;
