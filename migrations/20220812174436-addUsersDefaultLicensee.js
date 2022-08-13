module.exports = {
    async up(db, client) {
        await db.collection('users').updateMany( {}, { $set: { licensee: 'basic' } } )
    },

    async down(db, client) {
        await db.collection('users').updateMany( {}, { $unset: { licensee: 1 } } )
    },
}
