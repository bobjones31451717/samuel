const { DB }  = require('./connection.js');
const { LOG }  = require('./log.js');
require('dotenv').config();
'use strict';
const router = require('express').Router();
router.get('/todos', async function(req, res){
  try{
    const todolist = await DB.find(process.env.DB_NAME, process.env.COLLECTION_NAME, {}, {});

    await LOG.assertLog('GET')
    //var myJsonString = {}
    //for (const s of todolist) {
     // myJsonString[""] = s
    //}
    //console.log(myJsonString)
    res.status(200).send({ todos : todolist });
  }catch(error){
    return res.status(500).send(error.message);
  }
});
    
router.post('/todo/:id', async function (req, res) {
  try{
    const todo_to_add = req.body 
    const id = { _id: req.params.id };
    todo_to_add._id = id._id;
    todo_to_add.checked = false;
    await DB.insertOne(process.env.DB_NAME, process.env.COLLECTION_NAME, todo_to_add);
    await LOG.assertLog('POST')
    res.status(200).send(todo_to_add);
  }
  catch(error){
    if(error.status){
      return res.status(error.status).send(error.message);
    }
    return res.status(500).send(error.message);
  }
});
router.delete('/todo/:id', async function (req, res) {
  try{
    const id = { _id: req.params.id };
    await DB.deleteOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id);
    await LOG.assertLog('DELETE')
    return res.status(200).send(id);
  }catch(error){
    if(error.status){
      return res.status(error.status).send(error.message);
    }
    return res.status(500).send(error.message);
  }
});
router.patch('/todo/messege/:id', async function (req, res) {
  try{
    const todo_to_update = req.body
    const id = { _id: req.params.id };
    const query_to_update = { $set: todo_to_update };
    await DB.updateOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id, query_to_update);
    await LOG.assertLog('PATCH')
    res.status(200).send(todo_to_update);
  }catch(error){
    if(error.status){
      return res.status(error.status).send(error.message);
    }
    return res.status(500).send(error.message);
  }
});
router.patch('/todo/checked/:id', async function (req, res) {
  try{
    const checked = req.body 
    const id = { _id: req.params.id };
    const check_to_update = { $set: checked };
    await DB.updateOne(process.env.DB_NAME, process.env.COLLECTION_NAME, id, check_to_update);
    await LOG.assertLog('PATCH')
    res.status(200).send(checked);
  }catch(error){
    if(error.status){
      return res.status(error.status).send(error.message);
    }
    return res.status(500).send(error.message);
  }
});


module.exports = router ; 