const { body, param } = require("express-validator");

const createTaskValidator = [
  body("title").notEmpty().withMessage("title is required"),
  body("description").optional().isString().withMessage("description must be a string"),
];

const updateTaskValidator = [
  param("id").isInt().withMessage("id must be an integer"),
  body("title").optional().isString().withMessage("title must be a string"),
  body("description").optional().isString().withMessage("description must be a string"),
  body("completed").optional().isBoolean().withMessage("completed must be boolean").toBoolean(),
];

const deleteTaskValidator = [
  param("id").isInt().withMessage("id must be an integer"),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  deleteTaskValidator
};