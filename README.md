# 🤖 BotVerse – CRUD de Proyectos y Flujos para Chatbots

**BotVerse** es una plataforma para gestionar proyectos y flujos conversacionales, ideal para diseñar y estructurar chatbots.  
Cuenta con un **backend en FastAPI + MongoDB** y un **frontend en Next.js**, ofreciendo un sistema completo de creación, visualización, edición y eliminación de proyectos y sus flujos asociados.

---

## ✨ Características principales

- 📁 **Proyectos**: Crear, listar, actualizar y eliminar proyectos.
- 🔄 **Flujos**: Crear, listar, editar (nombre) y eliminar flujos vinculados a proyectos.
- 🧩 **Frontend**: Interfaz interactiva con Next.js y TypeScript.
- ⚙️ **Backend**: API REST con FastAPI y MongoDB.
- 🔗 **Comunicación**: Fetch para consumo de la API.
- 🧪 **Pruebas**: Endpoints listos para Postman.

---

## ⚙️ Requisitos previos

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js (versión LTS)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/BOTVERSE.git
cd BOTVERSE
```

---

### 2. Backend – FastAPI

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

🔧 Asegúrate de que el servicio de MongoDB esté corriendo en `mongodb://localhost:27017`.  
Puedes cambiar la cadena de conexión en `app/config.py` si usas otra instancia.

```bash
# Iniciar servidor
uvicorn app.main:app --reload
```

📍 El backend estará disponible en:  
**http://127.0.0.1:8000**

---

### 3. Frontend – Next.js

```bash
cd ../frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

📍 El frontend estará disponible en:  
**http://localhost:3000**

---

### 4. Probar API con Postman

Puedes probar los siguientes endpoints REST:
```text
| Método | Endpoint                 | Descripción                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/projects/`             | Listar proyectos                     |
| POST   | `/projects/`             | Crear un nuevo proyecto              |
| GET    | `/projects/{id}/full`    | Obtener proyecto con sus flujos      |
| POST   | `/flows/`                | Crear un flujo en un proyecto        |
| PUT    | `/flows/{id}`            | Editar el nombre de un flujo         |
| DELETE | `/flows/{id}`            | Eliminar un flujo                    |
```
---

## 🗂️ Estructura del proyecto

```text
BOTVERSE/
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── routers/            # Rutas (projects, flows)
│   │   ├── config.py           # Configuración DB
│   │   └── utils.py            # Utilidades
├── frontend/                   # Aplicación Next.js
│   ├── app/                    # Archivos de configuración de la app
│   │   ├── favicon.ico         # Icono del sitio
│   │   ├── globals.css         # Estilos globales
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página principal
│   ├── components/             # Componentes reutilizables
│   │   ├── sidebar/            # Componentes de la barra lateral
│   │   ├── ui/                 # UI general
│   │   ├── canvas-toolbar.tsx
│   │   ├── canvas.tsx
│   │   ├── debug-panel.tsx
│   │   ├── header.tsx
│   │   ├── right-panel.tsx
│   │   ├── workflow-item.tsx
│   │   └── workflows.tsx
│   ├── hooks/                  # Hooks personalizados
│   │   └── use-query.ts
│   ├── lib/                    # Funciones auxiliares y utilidades
│   │   ├── api.ts              # Llamadas a la API
│   │   ├── types.ts            # Tipado
│   │   └── utils.ts            # Utilidades generales
│   ├── public/                 # Archivos públicos
│   ├── .gitignore              # Archivos ignorados por Git
│   ├── components.json         # Configuración de componentes
│   ├── eslint.config.mjs       # Configuración de ESLint
│   ├── next-env.d.ts           # Tipado de entornos Next.js
│   ├── next.config.ts          # Configuración del proyecto Next.js
│   ├── package-lock.json       # Dependencias bloqueadas
│   ├── package.json            # Dependencias y scripts del proyecto
│   ├── postcss.config.mjs      # Configuración de PostCSS
│   └── tsconfig.json           # Configuración de TypeScript
```