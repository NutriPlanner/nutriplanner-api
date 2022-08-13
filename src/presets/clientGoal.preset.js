const STATUS = {
    COMPLETED  : 'COMPLETED',
    INCOMPLETE : 'INCOMPLETE',
}

function STATUS_LIST() {
    return Object.values(STATUS)
}

module.exports = {
    STATUS,
    STATUS_LIST,
}
