const express = require('express');
const middlewares = require('./middlewares.js');
const externalRoutes = require('./externalRoutes.js');
const { DB }  = require('./connection.js');

const app = express();

app.use('/', middlewares);
app.use('/', externalRoutes);


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


module.exports = app.listen(process.env.PORT);