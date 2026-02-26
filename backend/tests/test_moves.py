"""
Tests de movimiento de personajes entre dimensiones.
"""


def test_move_character(client, sample_character):
    cid = sample_character["id"]
    r = client.post(
        f"/api/characters/{cid}/move",
        json={"target_dimension": "C-131"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == cid
    assert data["current_dimension"] == "C-131"
    assert data["name"] == sample_character["name"]


def test_move_character_persists(client, sample_character):
    cid = sample_character["id"]
    client.post(
        f"/api/characters/{cid}/move",
        json={"target_dimension": "C-131"},
    )
    r = client.get("/api/characters", params={"dimension": "C-131"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 1
    assert items[0]["current_dimension"] == "C-131"
    assert items[0]["id"] == cid


def test_move_character_not_found(client):
    r = client.post(
        "/api/characters/507f1f77bcf86cd799439011/move",
        json={"target_dimension": "C-137"},
    )
    assert r.status_code == 404


def test_move_character_invalid_id(client):
    r = client.post(
        "/api/characters/bad-id/move",
        json={"target_dimension": "C-137"},
    )
    assert r.status_code == 400


def test_move_then_list_filter(client, two_characters):
    rick = two_characters[0]
    client.post(
        f"/api/characters/{rick['id']}/move",
        json={"target_dimension": "C-131"},
    )
    r = client.get("/api/characters", params={"dimension": "C-131"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2
    dims = {x["current_dimension"] for x in items}
    assert dims == {"C-131"}
