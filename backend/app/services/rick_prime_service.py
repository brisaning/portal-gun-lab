"""
Lógica de negocio de Rick Prime: robo de personaje, piedra dimensional y bóveda Prime.
"""
import logging
from datetime import datetime
from typing import Optional, Tuple

from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError

from app.database import get_characters_collection

logger = logging.getLogger(__name__)

# Tipo de documento para distinguir personajes de piedras dimensionales
DOC_TYPE_CHARACTER = "character"
DOC_TYPE_DIMENSIONAL_STONE = "dimensional_stone"

# Dimensión especial donde Rick Prime guarda sus trofeos (no se puede arrastrar aquí)
RICK_PRIME_DIMENSION = "RICK_PRIME_DIMENSION"


def _character_filter() -> dict:
    """Filtro para obtener solo documentos que son personajes (no piedras)."""
    return {"type": {"$ne": DOC_TYPE_DIMENSIONAL_STONE}}


async def select_random_character() -> Optional[dict]:
    """
    Selecciona un personaje aleatorio de dimensiones regulares (excluyendo Prime y piedras).
    """
    coll = get_characters_collection()
    match = {
        **_character_filter(),
        "current_dimension": {"$ne": RICK_PRIME_DIMENSION},
    }
    pipeline = [
        {"$match": match},
        {"$sample": {"size": 1}},
    ]
    cursor = coll.aggregate(pipeline)
    docs = await cursor.to_list(length=1)
    return docs[0] if docs else None


def _new_stone_document(character_doc: dict) -> dict:
    """Construye el documento de piedra dimensional (nuevo _id) para dejar en la dimensión original."""
    dimension = character_doc.get("current_dimension", "unknown")
    return {
        "_id": ObjectId(),
        "type": DOC_TYPE_DIMENSIONAL_STONE,
        "previous_character_id": str(character_doc["_id"]),
        "dimension": dimension,
        "created_at": datetime.utcnow(),
    }


async def steal_character() -> Optional[Tuple[dict, dict]]:
    """
    Lógica completa de robo de Rick Prime:
    1. Selecciona un personaje aleatorio de dimensiones regulares (no Prime).
    2. Inserta una nueva piedra dimensional en la dimensión del personaje.
    3. Mueve el personaje a RICK_PRIME_DIMENSION y marca stolen_by_rick_prime/original_dimension.
    4. Devuelve (personaje actualizado, piedra creada).

    Devuelve (character_doc, stone_doc) o None si no hay personajes para robar.
    """
    character_doc = await select_random_character()
    if character_doc is None:
        logger.warning("Rick Prime no pudo robar: no hay personajes disponibles")
        return None

    coll = get_characters_collection()
    oid = character_doc["_id"]
    old_dimension = character_doc.get("current_dimension", "unknown")

    try:
        stone_doc = _new_stone_document(character_doc)
        await coll.insert_one(stone_doc)
        logger.info(
            "Piedra dimensional creada: id=%s dimension=%s",
            stone_doc["_id"],
            stone_doc["dimension"],
        )

        result = await coll.find_one_and_update(
            {"_id": oid, **_character_filter()},
            {
                "$set": {
                    "current_dimension": RICK_PRIME_DIMENSION,
                    "stolen_by_rick_prime": True,
                    "original_dimension": old_dimension,
                }
            },
            return_document=ReturnDocument.AFTER,
        )
        if result is None:
            raise PyMongoError("No se pudo actualizar el personaje a Prime")
        logger.info(
            "Rick Prime robó personaje: id=%s name=%s -> %s",
            oid,
            result.get("name"),
            RICK_PRIME_DIMENSION,
        )
        return (result, stone_doc)
    except PyMongoError as e:
        logger.exception("Error en steal_character: %s", e)
        raise
