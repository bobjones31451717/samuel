const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

class DB {
  static async getDB() {
    if (this.db) return this.db;
    this.db = await MongoClient.connect(this.url);
    return this.db;
  }
  static async insertOne(dbName, collectionName, object) {
    let insertedResponce
    try{
        insertedResponce = await this.db.db(dbName).collection(collectionName).insertOne(object);
    }
    catch(error){
        if (error.code == 11000 ){
            error.status = 400;
            throw error
        } 
    }
    if(insertedResponce.insertedCount==0){
        const insertError = new Error("nothing inserted")
        insertError.status = 400
        return insertError
    }
  }
  static async deleteOne(dbName, collectionName, id) {
    const deletedResponce = await this.db.db(dbName).collection(collectionName).deleteOne(id);
    if(deletedResponce.deletedCount==0){
        const deleteError = new Error("nothing deleted, the id you supplied doesnt match any of the id's in db")
        deleteError.status = 400;
        throw deleteError
    }
  }
  static async updateOne(dbName, collectionName, id, query_to_update) {
    const updatedResponce = await this.db.db(dbName).collection(collectionName).updateOne(id, query_to_update);
    if(updatedResponce.modifiedCount==0){
        const modefiedError = new Error("nothing modefied, the id you supplied doesnt match any of the id's in db")
        modefiedError.status = 400;
        throw modefiedError
    }
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