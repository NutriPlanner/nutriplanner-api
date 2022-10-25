const mongoose = require('mongoose')
const validator = require('validator')
const { tenantModel } = require('./utils/tenant')
const { toJSON, paginate } = require('./plugins')

const { ClientGoal, Tracking } = require('../models')

const clientSchema = mongoose.Schema(
    {
        name: {
            type      : String,
            required  : true,
            trim      : true,
            uppercase : true,
        },
        last_name: {
            type      : String,
            required  : true,
            trim      : true,
            uppercase : true,
        },
        dni: {
            type     : String,
            required : true,
            trim     : true,
        },
        birthday: {
            type     : String,
            required : true,
            trim     : true,
        },
        address: {
            type      : String,
            required  : true,
            trim      : true,
            uppercase : true,
        },
        phone: {
            type     : String,
            required : true,
            trim     : true,
        },
        email: {
            type      : String,
            required  : true,
            trim      : true,
            uppercase : true,
            validate(value) {
                if (!validator.isEmail(value))
                    throw new Error('Invalid email')
            },
        },
    },
    {
        timestamps: true,
    },
)

// Plugins

// add plugin that converts mongoose to json
clientSchema.plugin(toJSON)
clientSchema.plugin(paginate)


/**
 * Remove in cascade.
 */
clientSchema.pre('remove', async function() {
    return await Promise.all( [
        ClientGoal().remove( { client: this._id } ).exec(),
        Tracking().remove( { client: this._id } ).exec(),
    ] )
} )

module.exports = tenantModel('Client', clientSchema)
