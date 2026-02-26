"""
Portal Gun Character Lab - FastAPI Backend
Temática psicodélica con verdes neón.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Portal Gun Character Lab API",
    description="API para el laboratorio de personajes Portal Gun",
    version="0.1.0",
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


@app.get("/")
def root():
    return {"message": "Portal Gun Character Lab API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}
