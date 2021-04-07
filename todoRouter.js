const { DB }  = require('./connection.js');

require('dotenv').config();
'use strict';

const todoRouter = require('express').Router();

todoRouter.get('/todos', async function(req, res){
  try{
    const todolist = await DB.find(process.env.DB_NAME, process.env.COLLECTION_NAME, {}, {});
    res.status(200).send({ todos : todolist });
  }catch(error){
    return res.status(500).send(error.message);
  }
});
    
todoRouter.post('/todo/:id', async function (req, res) {
  try{
    const todo_to_add = req.body 
    const id = { _id: req.params.id };
    todo_to_add._id = id._id;
    todo_to_add.checked = false;
    const addedTodo = await DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, todo_to_add);
    if(addedTodo.insertedCount==0){
      const insertError = new Error("nothing inserted")
      insertError.status = 400
      throw insertError
    }
    res.status(200).send(todo_to_add);
  }
  catch(error){
    if (error.code == 11000 ){
      error.status = 400;
    } 
    return res.status(error.status ? error.status : 500).send(error.message);
    }
});

todoRouter.delete('/todo/:id', async function (req, res) {
  try{
    const id = { _id: req.params.id };
    const deletedResponce = await DB.deleteOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id);
    if(deletedResponce.deletedCount==0){
      const deleteError = new Error("nothing deleted, the id you supplied doesnt match any of the id's in db")
      deleteError.status = 400;
      throw deleteError
  }
    return res.status(200).send(id);
  }catch(error){
    return res.status(error.status ? error.status : 500).send(error.message);
  }
});

todoRouter.patch('/todo/messege/:id', async function (req, res) {
  try{
    const todo_to_update = req.body
    const id = { _id: req.params.id };
    const query_to_update = { $set: todo_to_update };
    const updatedResponce = await DB.updateOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id, query_to_update);
    if(updatedResponce.modifiedCount==0){
      const modefiedError = new Error("nothing modefied, the id you supplied doesnt match any of the id's in db")
      modefiedError.status = 400;
      throw modefiedError
    }
    res.status(200).send(todo_to_update);
  }catch(error){
    return res.status(error.status ? error.status : 500).send(error.message);
  }
});

todoRouter.patch('/todo/checked/:id', async function (req, res) {
  try{
    const checked = req.body 
    const id = { _id: req.params.id };
    const check_to_update = { $set: checked };
    const updatedResponce = await DB.updateOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id, check_to_update);
    if(updatedResponce.modifiedCount==0){
      const modefiedError = new Error("nothing modefied, the id you supplied doesnt match any of the id's in db")
      modefiedError.status = 400;
      throw modefiedError
  }
    res.status(200).send(checked);
  }catch(error){
    return res.status(error.status ? error.status : 500).send(error.message);
  }
});


module.exports = todoRouter ; 