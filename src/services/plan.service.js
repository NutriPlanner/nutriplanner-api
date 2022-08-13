const httpStatus = require('http-status')
const InternalCode = require('../utils/InternalCode')
const { Plan } = require('../models')
const ApiError = require('../utils/ApiError')

/**
 * Create a plan
 * @param {Object} planBody
 * @returns {Promise<Plan>}
 */
const createPlan = async (planBody) => {
    return Plan().create(planBody)
}

/**
 * Query for plan page
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPlanPage = async (filter, options) => {
    const planPage = await Plan().paginate(JSON.parse(filter), options)

    return planPage
}

/**
 * Get plan by id
 * @param {ObjectId} id
 * @returns {Promise<Plan>}
 */
const getPlanById = async (id) => await Plan().findById(id)

/**
 * Update plan by id
 * @param {ObjectId} planId
 * @param {Object} updateBody
 * @returns {Promise<Plan>}
 */
const updatePlanById = async (planId, updateBody) => {
    const plan = await getPlanById(planId)
    if (!plan) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.PLAN__UPDATE__NOT_FOUND,
            data         : { id: planId },
            message      : 'Plan not found',
        } )
    }

    Object.assign(plan, updateBody)

    await plan.save()

    return plan
}

/**
 * Delete plan by id
 * @param {ObjectId} planId
 * @returns {Promise<Plan>}
 */
const deletePlanById = async (planId) => {
    const plan = await getPlanById(planId)
    if (!plan) {
        throw new ApiError( {
            statusCode   : httpStatus.NOT_FOUND,
            internalCode : InternalCode.PLAN__DELETE__NOT_FOUND,
            data         : { id: planId },
            message      : 'Plan not found',
        } )
    }
    await plan.remove()

    return plan
}

module.exports = {
    createPlan,
    queryPlanPage,
    getPlanById,
    updatePlanById,
    deletePlanById,
}
