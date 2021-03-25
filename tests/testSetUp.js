require('dotenv').config();
const {Connection}  = require("../connection.js")

let todos;
let db;

  ( async () => {
  try {
    db = await Connection.getDB();
    todos = db.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
  } catch (error) {
    console.error(error);    
  }
  run();
}
)()

beforeEach(() => {
  return todos.deleteMany();
});
  after(() => {
  return db.db(process.env.DB_NAME).dropDatabase()
});
