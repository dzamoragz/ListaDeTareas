// frontend/src/api/http.js
import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // usa variable de entorno o puerto 5000 por defecto
});

// Interceptor para JWT (lee token desde localStorage)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.errors?.length) return err.response.data.errors[0].msg;
  return err?.message || 'Unexpected error';
}

// También exporta default para compatibilidad con import default
export default http;