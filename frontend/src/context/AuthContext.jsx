// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginApi, register as registerApi } from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  async function login(credentials) {
    setLoading(true); setError('')
    try {
      const res = await loginApi(credentials) // { success, message, user, token }
      if (!res?.success || !res?.token) {
        const msg = res?.message || 'Login failed'
        setError(msg)
        return { success: false, message: msg }
      }
      setToken(res.token)
      setUser(res.user)
      return { success: true, message: res.message || 'Login successful' }
    } catch (e) {
      const msg = e.message || 'Login failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  async function register(payload) {
    setLoading(true); setError('')
    try {
      const res = await registerApi(payload) // idealmente trae { success, message, user, token }
      if (res?.success && res?.token && res?.user) {
        // Caso A: el backend ya devuelve token y user
        setToken(res.token)
        setUser(res.user)
        return { success: true, message: res.message || 'User registered' }
      }
      // Caso B: el register no devolvió token → auto-login
      const auto = await login({ email: payload.email, password: payload.password })
      return auto
    } catch (e) {
      const msg = e.message || 'Registration failed'
      setError(msg)
      return { success: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setToken(''); setUser(null); setError('')
  }

  const value = useMemo(() => ({ token, user, loading, error, login, register, logout }), [token, user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}