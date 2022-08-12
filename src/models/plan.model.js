const mongoose = require('mongoose')
const { tenantModel } = require('./utils/tenant')
const { toJSON, paginate } = require('./plugins')

const planSession = mongoose.Schema(
    {
        subject: {
            type     : String,
            required : true,
            trim     : true,
        },
        start: {
            type     : String,
            required : true,
            trim     : true,
            validate(value) {
                if (Number(value) < 1)
                    throw new Error('Start must be a positive number')
            },
        },
    },
    {
        _id : false,
        id  : false,
    },
)

const planSchema = mongoose.Schema(
    {
        name: {
            type      : String,
            required  : true,
            trim      : true,
            uppercase : true,
        },
        description: {
            type     : String,
            required : false,
        },
        sessions: {
            type     : [ planSession ],
            required : true,
            validate(value) {
                if (value.length === 0)
                    throw new Error('Sessions are required')
            },
        },
    },
    {
        timestamps : true,
        toObject   : {
            virtuals: true,
        },
        toJSON: {
            virtuals: true,
        },
    },
)

// add plugin that converts mongoose to json
planSchema.plugin(toJSON)
planSchema.plugin(paginate)

planSchema.virtual('sessions_count').get(function() {
    return this.sessions.length
} )

module.exports = tenantModel('Plan', planSchema)
