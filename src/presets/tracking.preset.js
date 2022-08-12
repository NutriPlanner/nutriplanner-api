const STATUS = {
    PENDING : 'PENDING',
    DONE    : 'DONE',
    CLOSED  : 'CLOSED',
}

function STATUS_LIST() {
    return Object.values(STATUS)
}

module.exports = {
    STATUS,
    STATUS_LIST,
}
