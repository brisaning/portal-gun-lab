import os
import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("MONGO_DB_NAME", "portal_gun_lab_test")

from main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def clear_db(client):
    r = client.delete("/api/test/clear-db")
    if r.status_code == 404:
        pytest.skip("Clear endpoint not available")
    assert r.status_code == 200
    yield


@pytest.fixture
def sample_character(client):
    payload = {
        "name": "Morty Test",
        "status": "alive",
        "species": "Human",
        "origin_dimension": "C-137",
        "current_dimension": "C-137",
        "image_url": None,
    }
    r = client.post("/api/characters", json=payload)
    assert r.status_code == 201
    return r.json()


@pytest.fixture
def two_characters(client):
    chars = []
    for name, dim in [("Rick A", "C-137"), ("Morty B", "C-131")]:
        r = client.post(
            "/api/characters",
            json={
                "name": name,
                "status": "alive",
                "species": "Human",
                "origin_dimension": dim,
                "current_dimension": dim,
            },
        )
        assert r.status_code == 201
        chars.append(r.json())
    return chars
