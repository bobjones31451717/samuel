const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

class DB {
  static async getDB() {
    if (this.db) return this.db;
    this.db = await MongoClient.connect(this.url);
    return this.db;
  }
  static async insertOne(dbName, collectionName, object) {
    const collection = this.db.db(dbName).collection(collectionName);
    await collection.insertOne(object);
  }
  static async deleteOne(dbName, collectionName, id) {
    const collection = this.db.db(dbName).collection(collectionName);
    await collection.deleteOne(id);
  }
  static async updateOne(dbName, collectionName, id, query_to_update) {
    const collection = this.db.db(dbName).collection(collectionName);
    await collection.updateOne(id, query_to_update);
  }
  static async find(dbName, collectionName, query, projection) {
    const collection = this.db.db(dbName).collection(collectionName);
    const returnedCollection = await collection.find(query, projection).toArray();
    return returnedCollection;
  }
  static async deleteMany(dbName, collectionName) {
    const collection = this.db.db(dbName).collection(collectionName);
    await collection.deleteMany();
  }
  static async dropDatabase(dbName) {
    const dbToDrop = this.db.db(dbName);
    await dbToDrop.dropDatabase();
  }
}

DB.db = null;
DB.url = process.env.URL;
module.exports = { DB };