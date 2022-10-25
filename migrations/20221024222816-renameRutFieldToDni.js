module.exports = {
    async up(db, client) {
        await db.collection('clients').updateMany( {}, { $rename: { rut: 'dni' } } )
    },

    async down(db, client) {
    },
}
