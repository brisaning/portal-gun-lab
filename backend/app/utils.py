"""
Utilidades compartidas (conversión de documentos a esquemas, etc.).
"""
from typing import Optional

from app.schemas import CharacterResponse


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
    )
