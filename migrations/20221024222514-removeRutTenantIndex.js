module.exports = {
    async up(db, client) {
        await db.collection('clients').dropIndex('rut_1_tenant_1')
    },

    async down(db, client) {
    },
}
