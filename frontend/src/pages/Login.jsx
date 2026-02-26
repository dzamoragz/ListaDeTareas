import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLocalError('')
    if (!email || !password) {
      setLocalError('Por favor, completa email y contraseña')
      return
    }
    const res = await login({ email, password })
    if (res.success) {
      navigate('/tasks')
    } else {
      setLocalError(res.message || 'No se pudo iniciar sesión')
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Iniciar sesión</h3>

      {(localError || error) && (
        <div className="alert alert-danger">{localError || error}</div>
      )}

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
            placeholder="******"
          />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-3">
        ¿No tienes cuenta?{' '}
        <Link to="/register">Crea una cuenta</Link>
      </p>
    </div>
  )
}
