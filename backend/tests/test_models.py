"""
Tests de modelos de dominio (Character, Dimension, PyObjectId).
"""
from datetime import datetime

import pytest
from bson import ObjectId

from app.models import Character, Dimension, PyObjectId


def test_pyobjectid_from_str():
    oid = ObjectId()
    s = str(oid)
    assert PyObjectId._validate(s, None) == s


def test_pyobjectid_from_objectid():
    oid = ObjectId()
    assert PyObjectId._validate(oid, None) == str(oid)


def test_pyobjectid_invalid_raises():
    with pytest.raises(ValueError, match="ObjectId inválido"):
        PyObjectId._validate("not-valid", None)


def test_pyobjectid_to_object_id():
    oid = ObjectId()
    s = str(oid)
    assert PyObjectId.to_object_id(s) == oid


def test_dimension_to_mongo():
    d = Dimension(name="C-137", description="Prime")
    data = d.to_mongo()
    assert data["name"] == "C-137"
    assert data["description"] == "Prime"
    assert "_id" not in data


def test_dimension_to_mongo_with_id():
    oid = ObjectId()
    d = Dimension(id=str(oid), name="C-137", description="")
    data = d.to_mongo()
    assert data["_id"] == oid


def test_character_to_mongo():
    c = Character(
        name="Rick",
        status="alive",
        species="Human",
        origin_dimension="C-137",
        current_dimension="C-137",
    )
    data = c.to_mongo()
    assert data["name"] == "Rick"
    assert data["status"] == "alive"
    assert "captured_at" in data
    assert "_id" not in data


def test_character_to_mongo_with_id():
    oid = ObjectId()
    c = Character(
        id=str(oid),
        name="Rick",
        status="alive",
        species="Human",
        origin_dimension="C-137",
        current_dimension="C-137",
    )
    data = c.to_mongo()
    assert data["_id"] == oid
