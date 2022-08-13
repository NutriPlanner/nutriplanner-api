module.exports = {
    async up(db, client) {
        // check if the collection exists
        let collection = null
        await db.listCollections( { name: 'clients' } )
            .next(function(err, coll) {
                if (coll)
                    collection = coll
            } )
        
        if (collection) {
            const existsRutIndex = await collection.indexExists('rut_1')

            if (existsRutIndex)
                collection.dropIndex('rut_1')
        }
    },

    async down(db, client) {
    },
}
