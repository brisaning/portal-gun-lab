"""
Lógica de negocio de Rick Prime: robo de personaje y reemplazo por piedra dimensional.
"""
import logging
from datetime import datetime
from typing import Optional

from pymongo.errors import PyMongoError

from app.database import get_characters_collection

logger = logging.getLogger(__name__)

# Tipo de documento para distinguir personajes de piedras dimensionales
DOC_TYPE_CHARACTER = "character"
DOC_TYPE_DIMENSIONAL_STONE = "dimensional_stone"


def _character_filter() -> dict:
    """Filtro para obtener solo documentos que son personajes (no piedras)."""
    return {"type": {"$ne": DOC_TYPE_DIMENSIONAL_STONE}}


async def select_random_character() -> Optional[dict]:
    """
    Selecciona un personaje aleatorio de la colección (excluyendo piedras dimensionales).
    Devuelve el documento del personaje o None si no hay ninguno.
    """
    coll = get_characters_collection()
    pipeline = [
        {"$match": _character_filter()},
        {"$sample": {"size": 1}},
    ]
    cursor = coll.aggregate(pipeline)
    docs = await cursor.to_list(length=1)
    return docs[0] if docs else None


def _dimensional_stone_document(character_doc: dict) -> dict:
    """
    Construye el documento de piedra dimensional que reemplaza al personaje.
    Conserva el mismo _id para mantener trazabilidad.
    """
    from bson import ObjectId

    oid = character_doc["_id"]
    dimension = character_doc.get("current_dimension", "unknown")
    return {
        "_id": oid,
        "type": DOC_TYPE_DIMENSIONAL_STONE,
        "previous_character_id": str(oid),
        "dimension": dimension,
        "created_at": datetime.utcnow(),
    }


async def replace_with_dimensional_stone(character_doc: dict) -> None:
    """
    Reemplaza el documento del personaje por una piedra dimensional.
    Actualiza la base de datos en el mismo _id.
    """
    coll = get_characters_collection()
    oid = character_doc["_id"]
    stone_doc = _dimensional_stone_document(character_doc)
    await coll.replace_one({"_id": oid}, stone_doc)
    logger.info(
        "Personaje reemplazado por piedra dimensional: id=%s dimension=%s",
        oid,
        stone_doc["dimension"],
    )


async def steal_character() -> Optional[dict]:
    """
    Lógica completa de robo de Rick Prime:
    1. Selecciona un personaje aleatorio.
    2. Reemplaza su documento por una piedra dimensional.
    3. Devuelve los datos del personaje robado (para respuesta API).

    Devuelve el documento del personaje robado o None si no hay personajes.
    """
    character_doc = await select_random_character()
    if character_doc is None:
        logger.warning("Rick Prime no pudo robar: no hay personajes disponibles")
        return None

    try:
        await replace_with_dimensional_stone(character_doc)
        return character_doc
    except PyMongoError as e:
        logger.exception("Error al reemplazar personaje por piedra dimensional: %s", e)
        raise
