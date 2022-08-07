const { getNamespace } = require('cls-hooked')

function getCurrentTenantId() {
    const ns = getNamespace('tenant')

    return ns.get('tenantId')
}

module.exports = {
    getCurrentTenantId,
}
