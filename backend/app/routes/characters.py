"""
Endpoints REST para personajes, insultos y Rick Prime.
Incluye manejo de errores y logging.
"""
import logging
import random
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query
from pymongo import ReturnDocument
from pymongo.errors import PyMongoError

from app.database import get_characters_collection
from app.schemas import (
    CharacterCreate,
    CharacterResponse,
    CharacterUpdate,
    MoveCharacterRequest,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["characters"])

# Lista de insultos al estilo Rick
INSULTS = [
    "Tu existencia es un insulto para todas las dimensiones.",
    "Eres más inútil que un Jerry en una convención de Ricks.",
    "Ni en la dimensión más miserable querrían tu ADN.",
    "Tu nivel de incompetencia atraviesa el multiverso.",
    "Eres la prueba de que el universo a veces se equivoca.",
    "Un Morty cualquiera tiene más valor que tú.",
    "Tu cerebro es un portal a la estupidez.",
    "La federación galáctica no querría ni regalado lo que produces.",
    "Eres el Jerry de los Jerries.",
    "En ninguna dimensión eres la opción preferible.",
]


def _doc_to_character_response(doc: Optional[dict]) -> Optional[CharacterResponse]:
    """Convierte un documento MongoDB a CharacterResponse."""
    if not doc:
        return None
    return CharacterResponse(
        id=str(doc["_id"]),
        name=doc["name"],
        status=doc["status"],
        species=doc["species"],
        origin_dimension=doc["origin_dimension"],
        current_dimension=doc["current_dimension"],
        image_url=doc.get("image_url"),
        captured_at=doc["captured_at"],
    )


def _validate_object_id(id: str) -> ObjectId:
    """Valida y devuelve ObjectId o lanza HTTP 400."""
    if not ObjectId.is_valid(id):
        logger.warning("ID de personaje inválido: %s", id)
        raise HTTPException(status_code=400, detail="ID de personaje inválido")
    return ObjectId(id)


# --- Characters CRUD ---


@router.get("/characters", response_model=list[CharacterResponse])
async def list_characters(
    dimension: Optional[str] = Query(
        default=None,
        description="Filtrar por dimensión actual del personaje",
    ),
) -> list[CharacterResponse]:
    """Lista todos los personajes, opcionalmente filtrados por dimensión."""
    try:
        coll = get_characters_collection()
        filter_query = {}
        if dimension is not None and dimension.strip():
            filter_query["current_dimension"] = dimension.strip()
        cursor = coll.find(filter_query).sort("name", 1)
        docs = await cursor.to_list(length=1000)
        result = []
        for doc in docs:
            resp = _doc_to_character_response(doc)
            if resp:
                result.append(resp)
        logger.info("Listados %d personajes (filtro dimension=%s)", len(result), dimension)
        return result
    except PyMongoError as e:
        logger.exception("Error listando personajes: %s", e)
        raise HTTPException(status_code=500, detail="Error al listar personajes") from e


@router.post("/characters", response_model=CharacterResponse, status_code=201)
async def create_character(body: CharacterCreate) -> CharacterResponse:
    """Crea un nuevo personaje."""
    try:
        coll = get_characters_collection()
        doc = body.model_dump()
        insert_result = await coll.insert_one(doc)
        new_id = str(insert_result.inserted_id)
        doc["_id"] = insert_result.inserted_id
        logger.info("Personaje creado: id=%s name=%s", new_id, body.name)
        return _doc_to_character_response(doc)
    except PyMongoError as e:
        logger.exception("Error creando personaje: %s", e)
        raise HTTPException(status_code=500, detail="Error al crear personaje") from e


@router.put("/characters/{id}", response_model=CharacterResponse)
async def update_character(id: str, body: CharacterUpdate) -> CharacterResponse:
    """Actualiza un personaje (p. ej. cambiar dimensión u otros campos)."""
    oid = _validate_object_id(id)
    update_data = body.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay campos a actualizar")
    try:
        coll = get_characters_collection()
        result = await coll.find_one_and_update(
            {"_id": oid},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )
        if result is None:
            logger.warning("Personaje no encontrado para actualizar: id=%s", id)
            raise HTTPException(status_code=404, detail="Personaje no encontrado")
        logger.info("Personaje actualizado: id=%s", id)
        return _doc_to_character_response(result)
    except HTTPException:
        raise
    except PyMongoError as e:
        logger.exception("Error actualizando personaje id=%s: %s", id, e)
        raise HTTPException(status_code=500, detail="Error al actualizar personaje") from e


@router.delete("/characters/{id}", status_code=204)
async def delete_character(id: str) -> None:
    """Elimina un personaje."""
    oid = _validate_object_id(id)
    try:
        coll = get_characters_collection()
        result = await coll.delete_one({"_id": oid})
        if result.deleted_count == 0:
            logger.warning("Personaje no encontrado para eliminar: id=%s", id)
            raise HTTPException(status_code=404, detail="Personaje no encontrado")
        logger.info("Personaje eliminado: id=%s", id)
    except HTTPException:
        raise
    except PyMongoError as e:
        logger.exception("Error eliminando personaje id=%s: %s", id, e)
        raise HTTPException(status_code=500, detail="Error al eliminar personaje") from e


@router.post("/characters/{id}/move", response_model=CharacterResponse)
async def move_character(id: str, body: MoveCharacterRequest) -> CharacterResponse:
    """Mueve un personaje a otra dimensión."""
    oid = _validate_object_id(id)
    try:
        coll = get_characters_collection()
        result = await coll.find_one_and_update(
            {"_id": oid},
            {"$set": {"current_dimension": body.target_dimension}},
            return_document=ReturnDocument.AFTER,
        )
        if result is None:
            logger.warning("Personaje no encontrado para mover: id=%s", id)
            raise HTTPException(status_code=404, detail="Personaje no encontrado")
        logger.info(
            "Personaje movido: id=%s -> dimension=%s",
            id,
            body.target_dimension,
        )
        return _doc_to_character_response(result)
    except HTTPException:
        raise
    except PyMongoError as e:
        logger.exception("Error moviendo personaje id=%s: %s", id, e)
        raise HTTPException(status_code=500, detail="Error al mover personaje") from e


# --- Insults ---


@router.get("/insults/random")
async def get_random_insult() -> dict:
    """Devuelve un insulto aleatorio al estilo Rick."""
    insult = random.choice(INSULTS)
    logger.debug("Insulto aleatorio solicitado")
    return {"insult": insult}


# --- Rick Prime ---


@router.post("/rick-prime/steal", response_model=CharacterResponse)
async def rick_prime_steal() -> CharacterResponse:
    """Rick Prime roba (elimina y devuelve) un personaje aleatorio."""
    try:
        coll = get_characters_collection()
        count = await coll.count_documents({})
        if count == 0:
            logger.warning("Rick Prime no pudo robar: no hay personajes")
            raise HTTPException(
                status_code=404,
                detail="No hay personajes para que Rick Prime robe",
            )
        # Obtener uno aleatorio y eliminarlo en una operación atómica si es posible.
        # MongoDB no tiene "find random and delete" atómico, así que: sample 1, luego delete.
        pipeline = [{"$sample": {"size": 1}}]
        cursor = coll.aggregate(pipeline)
        docs = await cursor.to_list(length=1)
        doc = docs[0]
        oid = doc["_id"]
        await coll.delete_one({"_id": oid})
        logger.info("Rick Prime robó personaje: id=%s name=%s", doc["_id"], doc.get("name"))
        return _doc_to_character_response(doc)
    except HTTPException:
        raise
    except PyMongoError as e:
        logger.exception("Error en rick-prime/steal: %s", e)
        raise HTTPException(
            status_code=500,
            detail="Error al ejecutar el robo de Rick Prime",
        ) from e
