"""
BotVerse API - Main Application Entry Point

This module initializes the FastAPI application and configures middleware,
routers, and global exception handlers.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import projects
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="BotVerse API",
    description="Workflow management system for creating and managing conversational flows",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from app.routers import flows, execution
app.include_router(projects.router)
app.include_router(flows.router)
app.include_router(execution.router)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for uncaught exceptions
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": "internal_error"
        }
    )

# Health check endpoint
@app.get("/", tags=["Health"])
def root():
    """
    Health check endpoint to verify API is running
    """
    return {
        "message": "BotVerse API funcionando",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health", tags=["Health"])
def health_check():
    """
    Detailed health check endpoint
    """
    return {
        "status": "healthy",
        "api": "BotVerse",
        "version": "1.0.0"
    }

# Application startup event
@app.on_event("startup")
async def startup_event():
    """
    Runs on application startup
    """
    logger.info("🚀 BotVerse API starting up...")
    logger.info("📝 API documentation available at /docs")

# Application shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Runs on application shutdown
    """
    logger.info("👋 BotVerse API shutting down...")
