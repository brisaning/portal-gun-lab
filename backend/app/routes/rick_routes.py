"""
Endpoints para insultos y Rick Prime.
Delegan en los servicios de negocio.
"""
import logging
from typing import Any

from fastapi import APIRouter, HTTPException

from pymongo.errors import PyMongoError

from app.database import get_characters_collection
from app.schemas import CharacterResponse, StoneResponse
from app.services.insult_service import get_random_insult
from app.services.rick_prime_service import DOC_TYPE_DIMENSIONAL_STONE, steal_character
from app.utils import doc_to_character_response, doc_to_stone_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["rick"])


@router.get("/insults/random")
async def get_random_insult_endpoint() -> dict:
    """Devuelve un insulto aleatorio al estilo Rick."""
    insult = get_random_insult()
    logger.debug("Insulto aleatorio solicitado")
    return {"insult": insult}


@router.post("/rick-prime/steal")
async def rick_prime_steal_endpoint() -> dict[str, Any]:
    """
    Rick Prime roba un personaje aleatorio de dimensiones regulares:
    lo mueve a la bóveda Prime, deja una piedra dimensional en su lugar,
    y devuelve el personaje y la piedra creada.
    """
    try:
        result = await steal_character()
        if result is None:
            raise HTTPException(
                status_code=404,
                detail="No hay personajes para que Rick Prime robe",
            )
        character_doc, stone_doc = result
        character_resp = doc_to_character_response(character_doc)
        stone_resp = doc_to_stone_response(stone_doc)
        if character_resp is None or stone_resp is None:
            raise HTTPException(
                status_code=500,
                detail="Error al formatear respuesta del robo",
            )
        logger.info(
            "Rick Prime robó personaje: id=%s name=%s",
            character_doc["_id"],
            character_doc.get("name"),
        )
        return {"character": character_resp.model_dump(), "stone": stone_resp.model_dump()}
    except HTTPException:
        raise
    except PyMongoError as e:
        logger.exception("Error en rick-prime/steal: %s", e)
        raise HTTPException(
            status_code=500,
            detail="Error al ejecutar el robo de Rick Prime",
        ) from e


@router.get("/stones", response_model=list[StoneResponse])
async def list_stones() -> list[StoneResponse]:
    """Lista todas las piedras dimensionales (dejadas por Rick Prime)."""
    try:
        coll = get_characters_collection()
        cursor = coll.find({"type": DOC_TYPE_DIMENSIONAL_STONE}).sort("dimension", 1)
        docs = await cursor.to_list(length=1000)
        result = []
        for doc in docs:
            resp = doc_to_stone_response(doc)
            if resp:
                result.append(resp)
        return result
    except PyMongoError as e:
        logger.exception("Error listando piedras: %s", e)
        raise HTTPException(status_code=500, detail="Error al listar piedras") from e
