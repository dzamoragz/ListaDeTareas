import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks.js'

export default function Tasks() {
  const { token, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all | done | todo

  async function load() {
    try {
      setLoading(true)
      setError('')
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) load()
  }, [token])

  async function onCreate(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      setLoading(true)
      setError('')
      const t = await createTask({ title: title.trim(), description: description.trim() })
      // t puede venir como {id,title,description,completed} o dentro de {task}
      const newTask = t?.task ?? t
      if (newTask) {
        setTasks(prev => [newTask, ...prev])
        setTitle('')
        setDescription('')
      } else {
        await load()
      }
    } catch (e) {
      setError(e.message || 'No se pudo crear la tarea')
    } finally {
      setLoading(false)
    }
  }

  async function onToggle(t) {
    try {
      setLoading(true)
      setError('')
      const updated = await updateTask({ id: t.id, completed: !t.completed })
      const up = updated?.task ?? updated
      setTasks(prev =>
        prev.map(x => (x.id === (up?.id ?? t.id)
          ? { ...x, completed: up?.completed ?? !t.completed, title: up?.title ?? x.title, description: up?.description ?? x.description }
          : x))
      )
    } catch (e) {
      setError(e.message || 'No se pudo actualizar la tarea')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id) {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    try {
      setLoading(true)
      setError('')
      await deleteTask({ id })
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      setError(e.message || 'No se pudo eliminar la tarea')
    } finally {
      setLoading(false)
    }
  }

  // Filtro simple en cliente
  const visibleTasks = tasks.filter(t => {
    if (filter === 'done') return t.completed === true
    if (filter === 'todo') return t.completed !== true
    return true
  })

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Mis tareas</h3>
        {user && <span className="text-muted small">Sesión: {user.email}</span>}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="card card-body mb-3" onSubmit={onCreate}>
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <input
              className="form-control"
              placeholder="Título de la tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Descripción (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-2 d-grid">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </div>
      </form>

      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button
          className={`btn btn-sm ${filter === 'todo' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('todo')}
        >
          Pendientes
        </button>
        <button
          className={`btn btn-sm ${filter === 'done' ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('done')}
        >
          Completadas
        </button>
      </div>

      {loading && tasks.length === 0 && (
        <div className="alert alert-info">Cargando...</div>
      )}

      {visibleTasks.length === 0 && !loading ? (
        <div className="alert alert-light border">No hay tareas</div>
      ) : (
        <ul className="list-group">
          {visibleTasks.map((t) => (
            <li
              key={t.id}
              className="list-group-item d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-start">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={!!t.completed}
                  onChange={() => onToggle(t)}
                />
                <div>
                  <div className={t.completed ? 'text-decoration-line-through' : ''}>
                    <strong>{t.title}</strong>
                  </div>
                  {t.description && (
                    <div className="text-muted small">{t.description}</div>
                  )}
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(t.id)}
                disabled={loading}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}