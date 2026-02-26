// backend/src/routes/tasks.js
const router = require("express").Router();
const verifyAuth = require("../middlewares/verifyAuth");
const { validationResult } = require("express-validator");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/tasks");

const {
  createTaskValidator,
  updateTaskValidator,
  deleteTaskValidator
} = require("../middlewares/validators/tasks.validator");

// Todas protegidas con JWT
router.use(verifyAuth);

// Listar tareas del usuario
// GET /tasks/getTask
router.get("/getTask", getTasks);

// Crear tarea
// POST /tasks/createTask
router.post("/createTask", createTaskValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devolvemos 400 con la lista de errores de validación
    return res.status(400).json({ errors: errors.array() });
  }
  return createTask(req, res);
});

// Actualizar tarea
// PUT /tasks/updated/:id
router.put("/updated/:id", updateTaskValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devolvemos 400 con la lista de errores de validación
    return res.status(400).json({ errors: errors.array() });
  }
  return updateTask(req, res);
});

// Eliminar tarea
// DELETE /tasks/delete/:id
router.delete("/delete/:id", deleteTaskValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devolvemos 400 con la lista de errores de validación
    return res.status(400).json({ errors: errors.array() });
  }
  return deleteTask(req, res);
});

module.exports = router;