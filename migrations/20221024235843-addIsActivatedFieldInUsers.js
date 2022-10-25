module.exports = {
    async up(db, client) {
        await db.collection('users').updateMany( {}, { $set: { isActivated: true } } )
    },

    async down(db, client) {
    },
}
