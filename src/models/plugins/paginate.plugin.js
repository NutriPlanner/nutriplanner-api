/* eslint-disable security/detect-object-injection */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose')
const _ = require('lodash')
const { isObjectId } = require('../../validations/custom.validation')

const paginate = (schema) => {
    /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
    /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
    schema.statics.paginate = async function (filter, options) {
        let sort = ''
        if (options.sortBy) {
            const sortingCriteria = []
            options.sortBy.split(',').forEach((sortOption) => {
                const [ key, order ] = sortOption.split(':')
                sortingCriteria.push((order === 'desc' ? '-' : '') + key)
            } )
            sort = sortingCriteria.join(' ')
        }
        else {
            sort = 'createdAt'
        }

        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1
        const skip = (page - 1) * limit

        
        // transform _id to ObjectId if it's a string
        const idFieldIndex = _.get(filter, '$or') ? _.get(filter, '$or').findIndex((field) => field['_id'] ) : -1
        if (idFieldIndex !== -1) {
            const idField = _.get(filter, '$or')[idFieldIndex]

            if (isObjectId(idField['_id'] )) {
                if (typeof idField['_id'] === 'string')
                    _.set(filter, '$or[' + idFieldIndex + ']._id', mongoose.Types.ObjectId(idField['_id'] ))
            }
            else {
                filter['$or'].splice(idFieldIndex, 1)
            }
        }


        const countPromise = this.countDocuments(filter).exec()
        let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit)

        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
                docsPromise = docsPromise.populate(
                    populateOption
                        .split('.')
                        .reverse()
                        .reduce((a, b) => ( { path: b, populate: a } )),
                )
            } )
        }

        docsPromise = docsPromise.exec()

        return Promise.all( [ countPromise, docsPromise ] ).then((values) => {
            const [ totalResults, results ] = values
            const totalPages = Math.ceil(totalResults / limit)
            const result = {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            }

            return Promise.resolve(result)
        } )
    }
}

module.exports = paginate
