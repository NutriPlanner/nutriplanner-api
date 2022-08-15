const mongoose = require('mongoose')
const { tenantModel } = require('./utils/tenant')
const { toJSON, paginate } = require('./plugins')
const { STATUS, STATUS_LIST } = require('../presets/clientGoal.preset')

const clientGoalTaskSchema = mongoose.Schema(
    {
        completed: {
            type    : Boolean,
            default : false,
        },
        description: {
            type     : String,
            required : true,
            trim     : true,
        },
    },
)

const clientGoalSchema = mongoose.Schema(
    {
        name: {
            type     : String,
            required : true,
            trim     : true,
        },
        status: {
            type     : String,
            required : true,
            enum     : [ ...STATUS_LIST() ],
            default  : STATUS.INCOMPLETE,
        },
        start_date: {
            type     : Date,
            required : true,
        },
        tasks: {
            type    : [ clientGoalTaskSchema ],
            default : [],
        },
        plan: {
            type     : String,
            required : false,
            default  : '',
        },
        active: {
            type     : Boolean,
            required : true,
            default  : false,
        },
        client: {
            type     : mongoose.Schema.Types.ObjectId,
            ref      : 'Client',
            required : true,
        },
    },
    {
        timestamps : true,
        collection : 'client_goals',
    },
)

// add plugin that converts mongoose to json
clientGoalSchema.plugin(toJSON)
clientGoalSchema.plugin(paginate)

/**
 * Check if exists a client goal active
 * @returns {Promise<boolean>}
 */
clientGoalSchema.statics.existsOneActive = async function (client) {
    const clientGoal = await this.findOne( { client, active: true } )

    return !!clientGoal
}

module.exports = tenantModel('ClientGoal', clientGoalSchema)
