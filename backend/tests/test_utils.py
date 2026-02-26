"""
Tests de utilidades (doc_to_character_response).
"""
from datetime import datetime

import pytest

from app.utils import doc_to_character_response


def test_doc_to_character_response_none():
    assert doc_to_character_response(None) is None


def test_doc_to_character_response_dimensional_stone():
    doc = {
        "_id": "507f1f77bcf86cd799439011",
        "type": "dimensional_stone",
        "dimension": "C-137",
    }
    assert doc_to_character_response(doc) is None


def test_doc_to_character_response_valid():
    doc = {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Rick",
        "status": "alive",
        "species": "Human",
        "origin_dimension": "C-137",
        "current_dimension": "C-137",
        "image_url": None,
        "captured_at": datetime.utcnow(),
    }
    r = doc_to_character_response(doc)
    assert r is not None
    assert r.id == str(doc["_id"])
    assert r.name == doc["name"]
    assert r.current_dimension == doc["current_dimension"]
