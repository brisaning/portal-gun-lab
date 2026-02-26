"""
Conexión asíncrona a MongoDB con Motor.
Colección 'characters' y manejo de errores con reconexión.
"""
import os
import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

logger = logging.getLogger(__name__)

# Configuración por defecto (desarrollo local con Docker)
DEFAULT_MONGODB_URL = "mongodb://admin:portalgun_secret@localhost:27017"
DATABASE_NAME = os.getenv("MONGO_DB_NAME", "portal_gun_lab")
COLLECTION_CHARACTERS = "characters"

_client: Optional[AsyncIOMotorClient] = None


def _get_mongodb_url() -> str:
    return os.getenv("MONGODB_URL", DEFAULT_MONGODB_URL)


async def connect_to_mongo() -> AsyncIOMotorClient:
    """
    Establece conexión con MongoDB usando Motor (asíncrono).
    Incluye manejo de errores y reintentos básicos.
    """
    global _client
    url = _get_mongodb_url()
    max_retries = 3
    last_error: Optional[Exception] = None

    for attempt in range(1, max_retries + 1):
        try:
            _client = AsyncIOMotorClient(
                url,
                serverSelectionTimeoutMS=5000,
                maxPoolSize=10,
                minPoolSize=1,
            )
            # Forzar verificación de conexión
            await _client.admin.command("ping")
            logger.info("Conexión a MongoDB establecida correctamente")
            return _client
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            last_error = e
            logger.warning(
                "Intento %d/%d: no se pudo conectar a MongoDB: %s",
                attempt,
                max_retries,
                str(e),
            )
            if attempt < max_retries:
                await _client.close() if _client else None
                _client = None
                import asyncio
                await asyncio.sleep(2 ** attempt)  # Backoff: 2s, 4s

    if _client:
        _client.close()
        _client = None
    if last_error:
        logger.error("Falló la conexión a MongoDB tras %d intentos", max_retries)
        raise last_error
    raise RuntimeError("No se pudo conectar a MongoDB")


async def close_mongo_connection() -> None:
    """Cierra la conexión con MongoDB."""
    global _client
    if _client:
        _client.close()
        _client = None
        logger.info("Conexión a MongoDB cerrada")


def get_client() -> AsyncIOMotorClient:
    """Devuelve el cliente Motor. Debe haberse llamado antes connect_to_mongo()."""
    if _client is None:
        raise RuntimeError(
            "MongoDB no está conectado. Ejecuta connect_to_mongo() al arrancar la aplicación."
        )
    return _client


def get_database() -> AsyncIOMotorDatabase:
    """Devuelve la base de datos principal."""
    return get_client()[DATABASE_NAME]


def get_characters_collection() -> AsyncIOMotorCollection:
    """
    Devuelve la colección 'characters'.
    Úsala para todas las operaciones CRUD de personajes.
    """
    return get_database()[COLLECTION_CHARACTERS]


async def ensure_indexes() -> None:
    """
    Crea índices recomendados para la colección characters.
    Útil ejecutarlo al iniciar la app.
    """
    try:
        coll = get_characters_collection()
        await coll.create_index("name", unique=False)
        await coll.create_index("created_at")
        logger.info("Índices de 'characters' verificados/creados")
    except Exception as e:
        logger.exception("Error creando índices en 'characters': %s", e)
        raise
