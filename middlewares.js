const { DB }  = require('./connection.js');
const { addTodoSchema, idSchema, checkedSchema } = require('./validation.js');

module.exports = (function() {

  'use strict';
  const bodyParser = require('body-parser');
  const express = require('express');
  const middlewares = require('express').Router();

  middlewares.use(bodyParser.json());

  middlewares.use(express.urlencoded({ extended: true }));

  middlewares.use('/', async function(req, res, next)  {
    if(!process.env.TEST){
      const time = new Date();
      const date = time.getTime();
      await DB.insertOne(process.env.DB_NAME, 'log', { 'method' : req.method, 'date': date , url : req.url });
    }
    next();
});

  middlewares.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send();
    }

    next();
});
  middlewares.post('/todo/:id', async function (req, res, next) {
    try{
      await addTodoSchema.validateAsync(req.body);
      await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
  middlewares.delete('/todo/:id', async function (req, res, next) {
    try{
      await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
  middlewares.patch('/todo/messege/:id', async function (req, res, next) {
    try{
      await addTodoSchema.validateAsync(req.body);
      await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
      
  middlewares.patch('/todo/checked/:id', async function (req, res, next) {
    try{
      await checkedSchema.validateAsync(req.body);
      await idSchema.validateAsync({ '_id' : req.params.id }); 
      next();
    }
    catch(error){
      return res.status(422).send(error.message);
    }
  });
      
  return middlewares;
})();