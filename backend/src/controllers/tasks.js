// backend/src/controllers/tasks.js
// Asegúrate de que este archivo exporta funciones, no un objeto vacío.
const db = require('../../config/db');
const conn = db.promise();

// GET /tasks
async function getTasks(req, res) {
  try {
    const [rows] = await conn.query(
      'SELECT id, title, description, completed FROM tasks WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    // Normalizamos completed a boolean en la respuesta
    const data = rows.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      completed: Number(t.completed) === 1
    }));
    return res.json(data);
  } catch (e) {
    console.error('Error getTasks:', e);
    return res.status(500).json({ success: false, message: 'Error al obtener tareas' });
  }
}

// POST /tasks
async function createTask(req, res) {
  const { title, description = '' } = req.body;
  try {
    const [result] = await conn.query(
      'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, req.user.id]
    );
    return res.status(201).json({
      success: true,
      message: 'Tarea creada',
      task: {
        id: result.insertId,
        title,
        description,
        completed: false
      }
    });
  } catch (e) {
    console.error('Error createTask:', e);
    return res.status(500).json({ success: false, message: 'Error al crear tarea' });
  }
}

// PUT /tasks/:id
async function updateTask(req, res) {
  const { id } = req.params;
  let { title, description, completed } = req.body;

  try {
    // Normalizar 'completed' si llega como string
    if (typeof completed === 'string') {
      if (completed.toLowerCase() === 'true') completed = true;
      else if (completed.toLowerCase() === 'false') completed = false;
    }

    // 1) Verificar que la tarea exista y sea del usuario
    const [foundRows] = await conn.query(
      'SELECT id, title, description, completed FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (foundRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
    const current = foundRows[0];

    // 2) Preparar los nuevos valores (si no vienen, conservar)
    const nextTitle = typeof title !== 'undefined' ? title : current.title;
    const nextDescription = typeof description !== 'undefined' ? description : current.description;
    const nextCompleted =
      typeof completed !== 'undefined' ? (completed ? 1 : 0) : current.completed;

    // 3) Detectar si no hay cambios reales
    const noChanges =
      nextTitle === current.title &&
      nextDescription === current.description &&
      Number(nextCompleted) === Number(current.completed);

    if (noChanges) {
      return res.status(200).json({
        success: true,
        message: 'Sin cambios',
        task: {
          id: current.id,
          title: current.title,
          description: current.description,
          completed: Number(current.completed) === 1
        }
      });
    }

    // 4) Actualizar
    await conn.query(
      `UPDATE tasks 
       SET title = ?, description = ?, completed = ?
       WHERE id = ? AND user_id = ?`,
      [nextTitle, nextDescription, nextCompleted, id, req.user.id]
    );

    // 5) Leer tarea actualizada y responder
    const [updatedRows] = await conn.query(
      'SELECT id, title, description, completed FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    const updated = updatedRows[0];

    return res.status(200).json({
      success: true,
      message: 'Tarea actualizada',
      task: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        completed: Number(updated.completed) === 1
      }
    });
  } catch (e) {
    console.error('Error updateTask:', e);
    return res.status(500).json({ success: false, message: 'Error al actualizar tarea' });
  }
}

// DELETE /tasks/:id
async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    const [result] = await conn.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
    return res.json({ success: true, message: 'Tarea eliminada' });
  } catch (e) {
    console.error('Error deleteTask:', e);
    return res.status(500).json({ success: false, message: 'Error al eliminar tarea' });
  }
}

// 👇 Esta línea es clave: exportar un objeto con las funciones
module.exports = { getTasks, createTask, updateTask, deleteTask };