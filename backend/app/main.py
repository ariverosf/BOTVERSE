# app/main.py
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Routers
from app.routers import projects, flows, auth

# 1) Instancia de la app
app = FastAPI(title="BotVerse API")

# 2) (Opcional) CORS para el frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3) Handlers de errores uniformes (Sprint 1)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

# 4) Montar routers (Sprint 1 + Sprint 2)
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(flows.router)

# 5) Healthcheck
@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "BOTVERSE API running "}
