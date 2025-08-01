# BotVerse – CRUD de Proyectos y Flujos para Chatbots
BotVerse es una plataforma que permite gestionar proyectos y flujos conversacionales para el diseño de chatbots.  
Incluye un backend en FastAPI con MongoDB y un frontend en Vue.js, permitiendo realizar un CRUD completo (crear, ver, editar y eliminar) tanto de proyectos como de flujos.


## Características principales
- Proyectos : Crear, listar, actualizar y eliminar.
- Flujos : Crear, listar, actualizar (nombre) y eliminar flujos asociados a un proyecto.
- Frontend : Interfaz en Vue.js para gestionar proyectos y flujos.
- Backend : API REST con FastAPI y MongoDB.
- Comunicación : Axios para conectar frontend y backend.
- Pruebas : Endpoints listos para Postman.


## Requisitos previos
- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js (LTS)](https://nodejs.org/) y npm
- [MongoDB](https://www.mongodb.com/try/download/community) (instancia local o remota)
- [Git](https://git-scm.com/)


## Instrucciones de instalación

1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/BOTVERSE.git
cd BOTVERSE

2. CONFIGURAR BACKEND
# ubicarse en la carpeta 
cd backend
# Crear entorno virtual
python -m venv venv
# Activar el entorno:
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate
# Instalar dependencias
pip install -r requirements.txt
# Configurar MongoDB
El servicio de MongoDB debe estar corriendo en mongodb://localhost:27017 o ajusta la cadena de conexión en app/config.py si es necesario.
# Levantar el servidor 
uvicorn app.main:app --reload
# El backend estará disponible
http://127.0.0.1:8000

3. CONFIGURAR FRONTEND
# ubicarse en la carpeta 
cd ../frontend
# Instalar dependencias
npm install
# Ejecutar servidor 
npm run serve
# Frontend estara disponible
http://localhost:8080

4. PROBAR API CON POSTMAN

Importa estos endpoints en Postman y prueba:

GET /projects/ → Lista proyectos.

POST /projects/ → Crea un proyecto.

GET /projects/{id}/full → Obtiene un proyecto con sus flujos.

POST /flows/ → Crea un flujo en un proyecto.

PUT /flows/{id} → Edita el nombre de un flujo.

DELETE /flows/{id} → Elimina un flujo.

5. ESTRUCTURA DLE PROYECTO

BOTVERSE/
├── backend/          # API FastAPI
│   ├── app/
│   │   ├── routers/  # Rutas (projects, flows)
│   │   ├── config.py # Configuración DB
│   │   └── utils.py  # Utilidades
├── frontend/         # Aplicación Vue.js
│   ├── src/
│   │   ├── views/    # Vistas (ProjectDetail)
│   │   └── api.js    # Configuración Axios
