// src/services/auth.js
import { http, getErrorMessage } from '../api/http.js'

export async function login({ email, password }) {
  try {
    const { data } = await http.post('/auth/login', { email, password })
    // { success, message, user, token }
    return data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function register({ email, password }) {
  try {
    const { data } = await http.post('/auth/register', { email, password })
    // { success, message, user, token }  (nuestro backend lo hace)
    return data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}