const MongoClient = require('mongodb').MongoClient
require('dotenv').config();

class Connection {
    static async getDB() {
        if (this.db) return this.db
        this.db = await MongoClient.connect(this.url)
        return this.db
    }

}

Connection.db = null
Connection.url = process.env.URL
module.exports = { Connection }