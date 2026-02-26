"""
Tests CRUD de personajes.
"""


def test_list_characters_empty(client):
    r = client.get("/api/characters")
    assert r.status_code == 200
    assert r.json() == []


def test_list_characters_with_filter_empty(client):
    r = client.get("/api/characters", params={"dimension": "C-137"})
    assert r.status_code == 200
    assert r.json() == []


def test_create_character(client):
    payload = {
        "name": "Rick Sanchez",
        "status": "alive",
        "species": "Human",
        "origin_dimension": "C-137",
        "current_dimension": "C-137",
        "image_url": "https://example.com/rick.png",
    }
    r = client.post("/api/characters", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["status"] == payload["status"]
    assert data["species"] == payload["species"]
    assert data["origin_dimension"] == payload["origin_dimension"]
    assert data["current_dimension"] == payload["current_dimension"]
    assert data["image_url"] == payload["image_url"]
    assert "id" in data
    assert "captured_at" in data


def test_create_character_invalid_status(client):
    payload = {
        "name": "Bad",
        "status": "invalid_status",
        "species": "Human",
        "origin_dimension": "C-137",
        "current_dimension": "C-137",
    }
    r = client.post("/api/characters", json=payload)
    assert r.status_code == 422


def test_list_characters_after_create(client, sample_character):
    r = client.get("/api/characters")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 1
    assert items[0]["id"] == sample_character["id"]
    assert items[0]["name"] == sample_character["name"]


def test_list_characters_filter_by_dimension(client, two_characters):
    r = client.get("/api/characters", params={"dimension": "C-137"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 1
    assert items[0]["current_dimension"] == "C-137"

    r2 = client.get("/api/characters", params={"dimension": "C-131"})
    assert r2.status_code == 200
    assert len(r2.json()) == 1
    assert r2.json()[0]["current_dimension"] == "C-131"


def test_update_character(client, sample_character):
    cid = sample_character["id"]
    r = client.put(
        "/api/characters/" + cid,
        json={"current_dimension": "C-131", "status": "captured"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["current_dimension"] == "C-131"
    assert data["status"] == "captured"
    assert data["id"] == cid


def test_update_character_empty_body(client, sample_character):
    r = client.put("/api/characters/" + sample_character["id"], json={})
    assert r.status_code == 400


def test_update_character_not_found(client):
    r = client.put(
        "/api/characters/507f1f77bcf86cd799439011",
        json={"name": "X"},
    )
    assert r.status_code == 404


def test_update_character_invalid_id(client):
    r = client.put("/api/characters/invalid-id", json={"name": "X"})
    assert r.status_code == 400


def test_delete_character(client, sample_character):
    cid = sample_character["id"]
    r = client.delete("/api/characters/" + cid)
    assert r.status_code == 204
    r2 = client.get("/api/characters")
    assert len(r2.json()) == 0


def test_delete_character_not_found(client):
    r = client.delete("/api/characters/507f1f77bcf86cd799439011")
    assert r.status_code == 404


def test_delete_character_invalid_id(client):
    r = client.delete("/api/characters/not-valid")
    assert r.status_code == 400
