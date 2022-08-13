const mongoose = require('mongoose')
const { tenantModel } = require('./utils/tenant')
const { STATUS, STATUS_LIST } = require('../presets/tracking.preset')
const { toJSON, paginate } = require('./plugins')

const measurementSchema = mongoose.Schema(
    {
        chest: {
            type     : String,
            required : false,
            trim     : true,
        },
        arm: {
            type     : String,
            required : false,
            trim     : true,
        },
        stomach: {
            type     : String,
            required : false,
            trim     : true,
        },
        waist: {
            type     : String,
            required : false,
            trim     : true,
        },
        thigh: {
            type     : String,
            required : false,
            trim     : true,
        },
        bottom: {
            type     : String,
            required : false,
            trim     : true,
        },
        body_mass: {
            type     : String,
            required : false,
            trim     : true,
        },
    },
    {
        id  : false,
        _id : false,
    },
)

const trackingSchema = mongoose.Schema(
    {
        measurement: {
            type     : measurementSchema,
            required : false,
            default  : {},
        },
        status: {
            type     : String,
            required : false,
            enum     : [ ...STATUS_LIST() ],
            default  : STATUS.PENDING,
        },
        date: {
            type    : Date,
            default : new Date(),
        },
        subject: {
            type     : String,
            required : true,
            trim     : true,
        },
        note: {
            type     : String,
            required : false,
            trim     : true,
        },
        client: {
            type     : mongoose.Schema.Types.ObjectId,
            ref      : 'Client',
            required : true,
        },
        goal: {
            type     : mongoose.Schema.Types.ObjectId,
            ref      : 'ClientGoal',
            required : false,
        },
    },
    {
        timestamps: true,
    },
)

// add plugin that converts mongoose to json
trackingSchema.plugin(toJSON)
trackingSchema.plugin(paginate)

trackingSchema.pre('save', async function (next) {
    const tracking = this
    tracking.date = new Date()
    next()
} )

module.exports = tenantModel('Tracking', trackingSchema)
