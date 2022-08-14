/* eslint-disable security/detect-object-injection */
const mongoose = require('mongoose')
const { getCurrentTenantId } = require('../../utils/tenant')

function tenantModel(name, schema, options) {
    return (props = {} ) => {
        schema.add( { tenant: {
            type    : String,
            private : true,
        } } )
        const Model = mongoose.model(name, schema, options)

        const { skipTenant } = props
        if (skipTenant) return Model

        Model.schema.set('discriminatorKey', 'tenant')
        
        const tenantId = getCurrentTenantId()
        const discriminatorName = `${Model.modelName}-${tenantId}`
        const existingDiscriminator = (Model.discriminators || {} )[discriminatorName]

        return existingDiscriminator || Model.discriminator(discriminatorName, mongoose.Schema( {} ))
    }
}

function tenantlessModel(name, schema, options) {
    return () => mongoose.model(name, schema, options)
}

module.exports = {
    tenantModel,
    tenantlessModel,
}
