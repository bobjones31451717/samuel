
require('dotenv').config();
const { DB }  = require('../connection.js');

beforeEach(function() {
  return DB.deleteMany(process.env.DB_NAME, process.env.COLLECTION_NAME);
});
after(function() {
  return DB.dropDatabase(process.env.DB_NAME);
});
