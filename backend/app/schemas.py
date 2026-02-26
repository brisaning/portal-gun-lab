"""
Esquemas Pydantic para la API: request/response.
Validaciones y tipos para Character y Dimension.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# --- Enums / constantes para validación ---

CHARACTER_STATUSES = {"alive", "dead", "unknown", "captured"}
NAME_MAX_LENGTH = 200
DESCRIPTION_MAX_LENGTH = 2000


def _strip_string(v: str) -> str:
    if isinstance(v, str):
        return v.strip()
    return v


# --- Dimension schemas ---


class DimensionBase(BaseModel):
    """Campos comunes de Dimension."""

    name: str = Field(..., min_length=1, max_length=NAME_MAX_LENGTH)
    description: str = Field(default="", max_length=DESCRIPTION_MAX_LENGTH)

    @field_validator("name", "description", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return _strip_string(v) if v else v


class DimensionCreate(DimensionBase):
    """Payload para crear una dimensión."""

    pass


class DimensionUpdate(BaseModel):
    """Payload para actualización parcial de una dimensión."""

    name: Optional[str] = Field(default=None, min_length=1, max_length=NAME_MAX_LENGTH)
    description: Optional[str] = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)

    @field_validator("name", "description", mode="before")
    @classmethod
    def strip_whitespace(cls, v):
        if v is None:
            return v
        return _strip_string(v) if v else v


class DimensionResponse(DimensionBase):
    """Dimensión en respuestas de la API."""

    id: str = Field(..., description="Identificador único (ObjectId como string)")

    model_config = {"from_attributes": True}


# --- Character schemas ---


class CharacterBase(BaseModel):
    """Campos comunes de Character."""

    name: str = Field(..., min_length=1, max_length=NAME_MAX_LENGTH)
    status: str = Field(..., min_length=1, max_length=50)
    species: str = Field(..., min_length=1, max_length=100)
    origin_dimension: str = Field(..., min_length=1, max_length=NAME_MAX_LENGTH)
    current_dimension: str = Field(..., min_length=1, max_length=NAME_MAX_LENGTH)
    image_url: Optional[str] = Field(default=None, max_length=2000)
    captured_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("name", "species", "origin_dimension", "current_dimension", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return _strip_string(v) if v else v

    @field_validator("status")
    @classmethod
    def status_allowed(cls, v: str) -> str:
        v_lower = v.strip().lower()
        if v_lower not in CHARACTER_STATUSES:
            raise ValueError(
                f"status debe ser uno de: {', '.join(sorted(CHARACTER_STATUSES))}"
            )
        return v_lower

    @field_validator("image_url")
    @classmethod
    def image_url_format(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        v = v.strip()
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("image_url debe ser una URL http o https")
        return v


class CharacterCreate(CharacterBase):
    """Payload para crear un personaje."""

    pass


class CharacterUpdate(BaseModel):
    """Payload para actualización parcial de un personaje."""

    name: Optional[str] = Field(default=None, min_length=1, max_length=NAME_MAX_LENGTH)
    status: Optional[str] = Field(default=None, min_length=1, max_length=50)
    species: Optional[str] = Field(default=None, min_length=1, max_length=100)
    origin_dimension: Optional[str] = Field(
        default=None, min_length=1, max_length=NAME_MAX_LENGTH
    )
    current_dimension: Optional[str] = Field(
        default=None, min_length=1, max_length=NAME_MAX_LENGTH
    )
    image_url: Optional[str] = Field(default=None, max_length=2000)
    captured_at: Optional[datetime] = None

    @field_validator("name", "species", "origin_dimension", "current_dimension", mode="before")
    @classmethod
    def strip_whitespace(cls, v):
        if v is None:
            return v
        return _strip_string(v) if v else v

    @field_validator("status")
    @classmethod
    def status_allowed(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v_lower = v.strip().lower()
        if v_lower not in CHARACTER_STATUSES:
            raise ValueError(
                f"status debe ser uno de: {', '.join(sorted(CHARACTER_STATUSES))}"
            )
        return v_lower

    @field_validator("image_url")
    @classmethod
    def image_url_format(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        v = v.strip()
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("image_url debe ser una URL http o https")
        return v


class CharacterResponse(CharacterBase):
    """Personaje en respuestas de la API."""

    id: str = Field(..., description="Identificador único (ObjectId como string)")
    stolen_by_rick_prime: bool = Field(default=False)
    original_dimension: Optional[str] = Field(default=None)

    model_config = {"from_attributes": True}


class StoneResponse(BaseModel):
    """Piedra dimensional en respuestas de la API."""

    id: str = Field(..., description="Identificador único de la piedra")
    dimension: str = Field(..., min_length=1, max_length=NAME_MAX_LENGTH)
    previous_character_id: str = Field(..., description="ID del personaje que fue robado")


class MoveCharacterRequest(BaseModel):
    """Payload para mover un personaje a otra dimensión."""

    target_dimension: str = Field(..., min_length=1, max_length=NAME_MAX_LENGTH)

    @field_validator("target_dimension", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return _strip_string(v) if v else v
