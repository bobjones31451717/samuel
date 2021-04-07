const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

class DB {
  static async getDB() {
    if (this.db) return this.db;
    this.db = await MongoClient.connect(this.url);
    return this.db;
  }
  static async insertOne(dbName, collectionName, object) {
        const insertedResponce = await this.db.db(dbName).collection(collectionName).insertOne(object);
        return insertedResponce
  }
  static async deleteOne(dbName, collectionName, id) {
    const deletedResponce = await this.db.db(dbName).collection(collectionName).deleteOne(id);
    return deletedResponce;
  }
  static async updateOne(dbName, collectionName, id, query_to_update) {
    const updatedResponce = await this.db.db(dbName).collection(collectionName).updateOne(id, query_to_update);
    return updatedResponce;
  }
  static async find(dbName, collectionName, query, projection) {
    const returnedCollection = await this.db.db(dbName).collection(collectionName).find(query, projection).toArray();
    return returnedCollection;
  }
  static async deleteMany(dbName, collectionName) {
    await this.db.db(dbName).collection(collectionName).deleteMany();
  }
  static async dropDatabase(dbName) {
    await this.db.db(dbName).dropDatabase();
  }
}

DB.db = null;
DB.url = process.env.URL;
module.exports = { DB };