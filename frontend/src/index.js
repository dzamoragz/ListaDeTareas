// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Bootstrap (opcional pero recomendado para tus estilos)
import 'bootstrap/dist/css/bootstrap.min.css';

// Auth context (asegúrate de que exista este archivo)
import { AuthProvider } from './context/AuthContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Si quieres medir performance, descomenta:
// reportWebVitals(console.log);
reportWebVitals();