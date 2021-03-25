const express = require("express");
//const bodyParser = require('body-parser')
//const MongoClient = require('mongodb').MongoClient;
const middlewares = require('./middlewares.js');
const externalRoutes = require('./externalRoutes.js');


const app = express();

app.use('/',middlewares);
//app.use(bodyParser.json());
//app.use(express.urlencoded({extended: true}))
app.use('/', externalRoutes);


module.exports = app.listen(3000);