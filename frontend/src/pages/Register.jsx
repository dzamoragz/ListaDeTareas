import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [okMsg, setOkMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLocalError('')
    setOkMsg('')

    if (!email || !password) {
      setLocalError('Email y contraseña son requeridos')
      return
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    const res = await register({ email, password })
    if (res.success) {
      setOkMsg(res.message || 'Usuario registrado correctamente')
      // El AuthContext hace auto-login; redirigimos a /tasks
      navigate('/tasks')
    } else {
      setLocalError(res.message || 'No se pudo registrar')
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Crear cuenta</h3>

      {(localError || error) && (
        <div className="alert alert-danger">{localError || error}</div>
      )}
      {okMsg && <div className="alert alert-success">{okMsg}</div>}

      <form onSubmit={onSubmit} className="card card-body">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 6 caracteres"
          />
        </div>

        <button className="btn btn-success" disabled={loading}>
          {loading ? 'Creando...' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-3">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  )
}