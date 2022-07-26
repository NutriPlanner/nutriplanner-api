const mongoose = require('mongoose');
const validator = require('validator');
const { format: formatRut } = require('rut.js');
const { toJSON, paginate } = require('./plugins');

const clientSchema = mongoose.Schema(
  {
    herba_id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    rut: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    birthday: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
clientSchema.plugin(toJSON);
clientSchema.plugin(paginate);

/**
 * Check if HerbaID is taken
 * @param {string} herbaId - The client's herbaId
 * @returns {Promise<boolean>}
 */
clientSchema.statics.isHerbaIdTaken = async function (herbaId, excludeClientId) {
  if (herbaId) {
    const client = await this.findOne({ herba_id: herbaId, _id: { $ne: excludeClientId } });
    return !!client;
  }
  return false;
};

/**
 * Check if rut is taken
 * @param {string} rut - The client's rut
 * @returns {Promise<boolean>}
 */
clientSchema.statics.isRutTaken = async function (rut, excludeClientId) {
  const client = await this.findOne({ rut, _id: { $ne: excludeClientId } });
  return !!client;
};

clientSchema.pre('save', async function (next) {
  const client = this;
  client.rut = formatRut(client.rut, { dots: false });

  next();
});

/**
 * @typedef Client
 */
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
