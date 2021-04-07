const express = require('express');
const middlewares = require('./middlewares.js');
const todoRouter = require('./todoRouter.js');
const { DB }  = require('./connection.js');

const app = express();

app.use('/', middlewares);
app.use('/', todoRouter);


( async () => {
  try {
    await DB.getDB();
  } catch (error) {
    console.error(error);    
  }
  finally {
    if(process.env.TEST){
      run();
    } 
  }
}
)();

app.listen(process.env.PORT)

module.exports = app;