const jwt = require('jsonwebtoken')

module.exports = (ns) => (req, res, next) => {
    ns.bindEmitter(req)
    ns.bindEmitter(res)

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        const payload = jwt.decode(token)

        ns.run( () => {
            ns.set('tenantId', payload.sub)
            next()
        } )
    }
    else {
        next()
    }
}
