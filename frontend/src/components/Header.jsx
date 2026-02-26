import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { token, logout, user } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login')
  }

  // Si prefieres ocultar el header cuando no hay sesión, descomenta esta línea:
  // if (!token) return null

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 shadow-sm">
      <div className="container">
        {/* Marca / Home */}
        <NavLink className="navbar-brand" to="/">
          To-Do
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* Navegación izquierda */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/tasks">
                    Mis tareas
                  </NavLink>
                </li>
                {/* Si luego agregas más páginas, habilítalas aquí */}
                {/* <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Perfil
                  </NavLink>
                </li> */}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Registro
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Zona derecha (usuario + logout) */}
          {token ? (
            <div className="d-flex align-items-center gap-2">
              {user && (
                <span className="text-muted small">
                  {user.name || user.email}
                </span>
              )}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={onLogout}
              >
                Salir
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  )
}