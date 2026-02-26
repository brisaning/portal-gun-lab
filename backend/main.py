"""
Portal Gun Character Lab - FastAPI Backend
Temática psicodélica con verdes neón.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import close_mongo_connection, connect_to_mongo, ensure_indexes
from app.routes import characters as characters_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Conexión a MongoDB al arrancar y cierre al apagar."""
    await connect_to_mongo()
    await ensure_indexes()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Portal Gun Character Lab API",
    description="API para el laboratorio de personajes Portal Gun",
    version="0.1.0",
    lifespan=lifespan,
)

# Configuración de CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters_routes.router)


@app.get("/")
def root():
    return {"message": "Portal Gun Character Lab API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}
