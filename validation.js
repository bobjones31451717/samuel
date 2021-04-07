const joi = require('@hapi/joi');

const addTodoSchema = joi.object({
  messege: joi.string().min(2).max(99).required()
});

const idSchema = joi.object({
  _id: joi.string().min(36).max(36).required()
});

const checkedSchema = joi.object({
  checked: joi.boolean().required()
});

module.exports = { addTodoSchema, idSchema, checkedSchema };