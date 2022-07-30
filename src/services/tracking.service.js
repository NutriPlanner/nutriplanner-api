const httpStatus = require('http-status');
const InternalCode = require('../utils/InternalCode');
const { Tracking } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a tracking
 * @param {Object} trackingBody
 * @returns {Promise<Tracking>}
 */
const createTracking = async (trackingBody) => Tracking.create(trackingBody);

/**
 * Query for tracking page
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTrackingPage = async (filter, options) => {
  const trackingPage = await Tracking.paginate(JSON.parse(filter), options);
  return trackingPage;
};

/**
 * Get tracking by id
 * @param {ObjectId} id
 * @returns {Promise<Tracking>}
 */
const getTrackingById = async (id) => Tracking.findById(id);

/**
 * Update tracking by id
 * @param {ObjectId} trackingId
 * @param {Object} updateBody
 * @returns {Promise<Tracking>}
 */
const updateTrackingById = async (trackingId, updateBody) => {
  const tracking = await getTrackingById(trackingId);
  if (!tracking) {
    throw new ApiError({
      statusCode: httpStatus.NOT_FOUND,
      internalCode: InternalCode.TRACKING__UPDATE__NOT_FOUND,
      data: { id: trackingId },
      message: 'Tracking not found',
    });
  }

  Object.assign(tracking, updateBody);

  await tracking.save();
  return tracking;
};

/**
 * Delete tracking by id
 * @param {ObjectId} trackingId
 * @returns {Promise<Tracking>}
 */
const deleteTrackingById = async (trackingId) => {
  const tracking = await getTrackingById(trackingId);
  if (!tracking) {
    throw new ApiError({
      statusCode: httpStatus.NOT_FOUND,
      internalCode: InternalCode.TRACKING__DELETE__NOT_FOUND,
      data: { id: trackingId },
      message: 'Tracking not found',
    });
  }
  await tracking.remove();
  return tracking;
};

module.exports = {
  createTracking,
  queryTrackingPage,
  getTrackingById,
  updateTrackingById,
  deleteTrackingById,
};
