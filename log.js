require('dotenv').config();
const { DB }  = require('./connection.js');

class LOG {

  static async assertLog(method) {
    if(!process.env.TEST){
        const time = new Date();
        const date = time.getTime();
        await DB.insertOne(process.env.DB_NAME, LOG.collection, { 'method' : method, 'date': date });
  }
}
}
LOG.collection = 'log';
module.exports = { LOG };