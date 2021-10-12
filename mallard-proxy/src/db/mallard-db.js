const MongoClient = require('mongodb').MongoClient
const url = process.env.DB_URL || 'mongodb://localhost:27017/'


const findAllClientOptions = () => {
    return MongoClient
        .connect(url)
        .then(client => {
                return client
                    .db('mallard')
                    .collection('client_options')
                    .find()
                    .toArray()
                    .finally(() => client.close())
            }
        )
}


module.exports = {
    findAllClientOptions
}