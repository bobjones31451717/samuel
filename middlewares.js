const { DB }  = require('./connection.js');
const { addTodoSchema, idSchema, checkedSchema } = require('./validation.js');
const globalTime = require('global-time');

module.exports = (function() {

  'use strict';
  const bodyParser = require('body-parser');
  const express = require('express');
  const middlewares = require('express').Router();

  middlewares.use(bodyParser.json());
  middlewares.use(express.urlencoded({ extended: true }));
  middlewares.use('/', async function (req, res, next) {
    if(!process.env.TEST){
    const time = await globalTime();
    const date = new Date(time);
    await DB.insertOne(process.env.DB_NAME, 'log', { 'method' : req.method, 'date': date });
    }
    next();
  });
  middlewares.post('/todo/:id', async function (req, res, next) {
    try{
      res.locals.todo_to_add = await addTodoSchema.validateAsync(req.body);
      res.locals.id = await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
  middlewares.delete('/todo/:id', async function (req, res, next) {
    try{
      res.locals.id = await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
  middlewares.patch('/todo/mssg/:id', async function (req, res, next) {
    try{
      res.locals.todo_to_update = await addTodoSchema.validateAsync(req.body);
      res.locals.id = await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
      
  middlewares.patch('/todo/checked/:id', async function (req, res, next) {
    try{
      res.locals.checked = await checkedSchema.validateAsync(req.body);
      res.locals.id = await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
      
  return middlewares;
})();