const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional()
});

module.exports = {
  createTaskSchema
};