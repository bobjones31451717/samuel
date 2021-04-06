const { DB }  = require('./connection.js');
require('dotenv').config();
'use strict';
const externalRoutes = require('express').Router();
externalRoutes.get('/todos', async function(req, res){
  try{
    const todolist = await DB.find(process.env.DB_NAME, process.env.COLLECTION_NAME, {}, {});
    res.json(todolist);
  }catch(error){
    return res.status(500).send(error.message);
  }
});
    
externalRoutes.post('/todo/:id', async function (req, res) {
  try{
    const todo_to_add = res.locals.todo_to_add;
    const id = res.locals.id;
    todo_to_add._id = id._id;
    todo_to_add.checked = false;
    await DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, todo_to_add);
    res.status(200).send(todo_to_add);
  }
  catch(error){
    return res.status(500).send(error.message);
  }
});
externalRoutes.delete('/todo/:id', async function (req, res) {
  try{
    const id = res.locals.id;
    await DB.deleteOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id);
    return res.status(200).send(id);
  }catch(error){
    return res.status(500).send(error.message);
  }
});
externalRoutes.patch('/todo/mssg/:id', async function (req, res) {
  try{
    const todo_to_update = res.locals.todo_to_update;
    const id = res.locals.id;
    const query_to_update = { $set: todo_to_update };
    await DB.updateOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id, query_to_update);
    res.status(200).send(todo_to_update);
  }catch(error){
    return res.status(500).send(error.message);
  }
});
externalRoutes.patch('/todo/checked/:id', async function (req, res) {
  try{
    const checked = res.locals.checked; 
    const id = res.locals.id;
    const check_to_update = { $set: checked };
    await DB.updateOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id, check_to_update);
    res.status(200).send(checked);
  }catch(error){
    return res.status(500).send(error.message);
  }
});


module.exports = externalRoutes ; 