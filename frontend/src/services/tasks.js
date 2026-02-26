import { http, getErrorMessage } from '../api/http.js'

/**
 * Obtiene todas las tareas del usuario autenticado.
 * Backend: GET /tasks/getTask
 */
export async function getTasks() {
  try {
    const { data } = await http.get('/tasks/getTask')
    // Puede venir como array directo o dentro de { data: [...] }
    return data?.data ?? data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Crea una tarea.
 * Backend: POST /tasks/createTask
 * Body: { title, description? }
 */
export async function createTask({ title, description = '' }) {
  try {
    const { data } = await http.post('/tasks/createTask', { title, description })
    // Nuestro backend responde: { success, message, task }
    return data?.data ?? data?.task ?? data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Actualiza una tarea.
 * Backend: PUT /tasks/updated/:id
 * Body permitido: { title?, description?, completed? }
 */
export async function updateTask({ id, title, description, completed }) {
  try {
    const payload = {}
    if (typeof title !== 'undefined') payload.title = title
    if (typeof description !== 'undefined') payload.description = description
    if (typeof completed !== 'undefined') payload.completed = completed

    const { data } = await http.put(`/tasks/updated/${id}`, payload)
    // Backend: { success, message, task }
    return data?.data ?? data?.task ?? data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/**
 * Elimina una tarea.
 * Backend: DELETE /tasks/delete/:id
 */
export async function deleteTask({ id }) {
  try {
    const { data } = await http.delete(`/tasks/delete/${id}`)
    // Backend: { success, message }
    return data?.data ?? data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}