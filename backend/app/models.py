"""
Modelos de dominio para MongoDB.
Estructura de documentos Character y Dimension.
"""
from datetime import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict
from pydantic_core import core_schema


class PyObjectId(str):
    """Tipo personalizado para ObjectId de MongoDB en Pydantic v2."""

    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: type, _handler) -> core_schema.CoreSchema:
        return core_schema.with_info_plain_validator_function(cls._validate)

    @classmethod
    def _validate(cls, v, _info):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("ObjectId inválido")

    @classmethod
    def to_object_id(cls, v: str) -> ObjectId:
        return ObjectId(v)


# --- Dimension (documento MongoDB) ---


class Dimension(BaseModel):
    """Modelo de dimensión almacenado en MongoDB."""

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)

    def to_mongo(self) -> dict:
        """Convierte a diccionario para insertar/actualizar en MongoDB."""
        data = self.model_dump(by_alias=True, exclude={"id"})
        if self.id is not None:
            data["_id"] = ObjectId(self.id)
        return data


# --- Character (documento MongoDB) ---


class Character(BaseModel):
    """Modelo de personaje almacenado en MongoDB."""

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str = Field(..., min_length=1, max_length=200)
    status: str = Field(..., min_length=1, max_length=50)
    species: str = Field(..., min_length=1, max_length=100)
    origin_dimension: str = Field(..., min_length=1, max_length=200)
    current_dimension: str = Field(..., min_length=1, max_length=200)
    image_url: Optional[str] = Field(default=None, max_length=2000)
    captured_at: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> dict:
        """Convierte a diccionario para insertar/actualizar en MongoDB."""
        data = self.model_dump(by_alias=True, exclude={"id"})
        if self.id is not None:
            data["_id"] = ObjectId(self.id)
        return data
