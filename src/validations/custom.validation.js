const isObjectId = (value) => value.match(/^[0-9a-fA-F]{24}$/)

const objectId = (value, helpers) => {
    if (!isObjectId(value))
        return helpers.message('"{{#label}}" must be a valid mongo id')
  
    return value
}

const password = (value, helpers) => {
    if (value.length < 8)
        return helpers.message('password must be at least 8 characters')

    return value
}

module.exports = {
    isObjectId,
    objectId,
    password,
}
