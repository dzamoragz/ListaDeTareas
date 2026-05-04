# To-Do List App (Proyecto Final FEWD-AGO25-KJ)

Aplicación web completa de lista de tareas con backend en Node.js/Express/MySQL y frontend en React/Bootstrap.

## 🛠️ Requisitos
- Node.js (v16+)
- npm
- MySQL 8
- Git (opcional)

## 📁 Estructura
```
backend/   # servidor Express + MySQL
frontend/  # aplicación React (Create React App)
```

## 🔧 Configuración
### 1. Base de datos
Ejecuta estas instrucciones en MySQL (puedes usar `mysql` CLI o Workbench):

```sql
CREATE DATABASE todo_app;
USE todo_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed TINYINT(1) DEFAULT 0,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 2. Variables de entorno
Copia los archivos `.env` que ya existen en cada carpeta si necesitas cambiarlos.

**backend/.env**
```ini
PORT=5000
JWT_SECRET=<tu secreto aquí>
DB_HOST=localhost
DB_USER=<tu usuario>
DB_PASSWORD=<tu contraseña>
DB_NAME=todo_app
```

**frontend/.env**
```ini
REACT_APP_API_URL=http://localhost:5000
```

Si cambias el puerto o la URL, asegúrate de actualizar ambas partes.

## 🚀 Ejecución
Terminal 1 - Backend:
```bash
cd backend
npm install        # si no se han instalado dependencias
npm run dev        # inicia el servidor en http://localhost:5000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install        # instala paquetes de React
npm start          # abre http://localhost:3000 en el navegador
```

## 🧪 Pruebas manuales
- Registra un usuario en `/register`
- Inicia sesión en `/login`
- Administra tareas en `/tasks` (crear, editar, completar, eliminar)

Puedes usar Postman para probar las rutas del backend directamente; el token JWT se envía en el header `Authorization: Bearer <token>`.

## 💡 Notas
- Las tareas están asociadas al usuario autenticado gracias al middleware `verifyAuth`.
- La aplicación usa Bootstrap para estilos y es responsive.

---
