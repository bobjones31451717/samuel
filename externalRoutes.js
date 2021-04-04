const {Connection}  = require("./connection.js")
const {addTodoSchema, idSchema, checkedSchema} = require('./validation.js')
const joi = require('joi');
require('dotenv').config();

let todos;

const run = async () => {
  try {
    const db = await Connection.getDB();
    todos = db.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
  } catch (error) {
    console.error(error);    
  }
}

run();

module.exports = (function() {
    'use strict';
    const externalRoutes = require('express').Router();
    externalRoutes.get('/todos',async function(req,res){
        try{
            const todolist = await todos.find({}).toArray()
            res.json(todolist)
        }catch(error){
           return res.status(500).send(error.message);
        }
      })
    
    externalRoutes.post("/todo/:id" , async function (req, res) {
        try{
            const todo_to_add = await addTodoSchema.validateAsync(req.body);
            let id = await idSchema.validateAsync({"_id" : req.params.id}) 
            todo_to_add["_id"] = id._id;
            todo_to_add["checked"] = false;
            const added = await todos.insertOne(todo_to_add);
            //console.log(added)
            res.status(200).send(todo_to_add)
        }
        catch(error){
            if(error.isJoi) return res.status(422).send(error.message);
            return res.status(500).send(error.message);
        }
      });
      externalRoutes.delete("/todo/:id" , async function (req, res) {
        try{
            let id = await idSchema.validateAsync({"_id" : req.params.id})
            await todos.deleteOne(id);
            return res.status(200).send(id)
        }catch(error){
            if(error.isJoi) return res.status(422).send(error.message);
            return res.status(500).send(error.message);
        }
      })
      externalRoutes.patch("/todo/mssg/:id" , async function (req, res) {
          try{
            let todo_to_update = await addTodoSchema.validateAsync(req.body);
            let id = await idSchema.validateAsync({"_id" : req.params.id}) 
            const query_to_update = { $set: todo_to_update };
            await todos.updateOne(id, query_to_update);
            res.status(200).send(todo_to_update)
          }catch(error){
            if(error.isJoi) return res.status(422).send(error.message);
            return res.status(500).send(error.message);
          }
      })
      externalRoutes.patch("/todo/checked/:id" , async function (req, res) {
        try{
          const checked = await checkedSchema.validateAsync(req.body)
          const id = await idSchema.validateAsync({"_id" : req.params.id}) 
          const check_to_update = { $set: checked };
          await todos.updateOne(id, check_to_update);
          res.status(200).send(checked)
        }catch(error){
            if(error.isJoi) return res.status(422).send(error.message);
            return res.status(500).send(error.message);
        }
    })


    return externalRoutes;
})();