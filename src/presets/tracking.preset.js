const STATUS = {
    PENDING : 'PENDING',
    DONE    : 'DONE',
}

function STATUS_LIST() {
    return Object.values(STATUS)
}

module.exports = {
    STATUS,
    STATUS_LIST,
}
