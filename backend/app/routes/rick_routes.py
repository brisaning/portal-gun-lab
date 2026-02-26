"""
Endpoints para insultos y Rick Prime.
Delegan en los servicios de negocio.
"""
import logging

from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError

from app.schemas import CharacterResponse
from app.services.insult_service import get_random_insult
from app.services.rick_prime_service import steal_character
from app.utils import doc_to_character_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["rick"])


@router.get("/insults/random")
async def get_random_insult_endpoint() -> dict:
    """Devuelve un insulto aleatorio al estilo Rick."""
    insult = get_random_insult()
    logger.debug("Insulto aleatorio solicitado")
    return {"insult": insult}


@router.post("/rick-prime/steal", response_model=CharacterResponse)
async def rick_prime_steal_endpoint() -> CharacterResponse:
    """
    Rick Prime roba un personaje aleatorio: lo reemplaza por una piedra dimensional
    en la base de datos y devuelve los datos del personaje robado.
    """
    try:
        character_doc = await steal_character()
        if character_doc is None:
            raise HTTPException(
                status_code=404,
                detail="No hay personajes para que Rick Prime robe",
            )
        response = doc_to_character_response(character_doc)
        if response is None:
            raise HTTPException(
                status_code=500,
                detail="Error al formatear personaje robado",
            )
        logger.info(
            "Rick Prime robó personaje: id=%s name=%s",
            character_doc["_id"],
            character_doc.get("name"),
        )
        return response
    except HTTPException:
        raise
    except PyMongoError as e:
        logger.exception("Error en rick-prime/steal: %s", e)
        raise HTTPException(
            status_code=500,
            detail="Error al ejecutar el robo de Rick Prime",
        ) from e
