import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { token } = useAuth()
  // Si no hay token, redirige a /login
  if (!token) return <Navigate to="/login" replace />
  // Si hay token, renderiza la página protegida
  return children
}