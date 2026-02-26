"""
Utilidades compartidas (conversión de documentos a esquemas, etc.).
"""
from typing import Optional

from app.schemas import CharacterResponse, StoneResponse


def doc_to_character_response(doc: Optional[dict]) -> Optional[CharacterResponse]:
    """Convierte un documento MongoDB de personaje a CharacterResponse."""
    if not doc or doc.get("type") == "dimensional_stone":
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
        stolen_by_rick_prime=doc.get("stolen_by_rick_prime", False),
        original_dimension=doc.get("original_dimension"),
    )


def doc_to_stone_response(doc: Optional[dict]) -> Optional[StoneResponse]:
    """Convierte un documento MongoDB de piedra dimensional a StoneResponse."""
    if not doc or doc.get("type") != "dimensional_stone":
        return None
    return StoneResponse(
        id=str(doc["_id"]),
        dimension=doc.get("dimension", ""),
        previous_character_id=doc.get("previous_character_id", ""),
    )
