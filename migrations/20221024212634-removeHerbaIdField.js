module.exports = {
    async up(db, client) {
        await db.collection('clients').updateMany( {}, { $unset: { herba_id: 1 } } )
    },

    async down(db, client) {
    },
}
