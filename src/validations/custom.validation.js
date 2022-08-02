const { validate: validateRut } = require('rut.js')

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/) )
        return helpers.message('"{{#label}}" must be a valid mongo id')
  
    return value
}

const password = (value, helpers) => {
    if (value.length < 8)
        return helpers.message('password must be at least 8 characters')

    return value
}

const rut = (value, helper) => {
    if (!validateRut(value) )
        return helper.message('rut is not valid')
  

    return value
}

module.exports = {
    objectId,
    password,
    rut,
}
