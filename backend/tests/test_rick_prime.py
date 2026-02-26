"""
Tests del robo de personajes por Rick Prime.
El robo mueve el personaje a RICK_PRIME_DIMENSION y deja una piedra en su lugar.
"""

from app.services.rick_prime_service import RICK_PRIME_DIMENSION


def test_rick_prime_steal_empty(client):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 404
    assert "No hay personajes" in r.json()["detail"]


def test_rick_prime_steal_returns_character_and_stone(client, sample_character):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 200
    data = r.json()
    assert "character" in data
    assert "stone" in data
    char = data["character"]
    stone = data["stone"]
    assert char["id"] == sample_character["id"]
    assert char["name"] == sample_character["name"]
    assert char["current_dimension"] == RICK_PRIME_DIMENSION
    assert char.get("stolen_by_rick_prime") is True
    assert stone["previous_character_id"] == sample_character["id"]
    assert stone["dimension"] == sample_character["current_dimension"]


def test_rick_prime_steal_moves_to_prime(client, sample_character):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 200
    r2 = client.get("/api/characters")
    assert r2.status_code == 200
    chars = r2.json()
    assert len(chars) == 1
    assert chars[0]["current_dimension"] == RICK_PRIME_DIMENSION
    assert chars[0]["id"] == sample_character["id"]


def test_rick_prime_steal_one_of_many(client, two_characters):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 200
    data = r.json()
    stolen_char = data["character"]
    stone = data["stone"]
    r2 = client.get("/api/characters")
    all_chars = r2.json()
    assert len(all_chars) == 2
    assert stolen_char["current_dimension"] == RICK_PRIME_DIMENSION
    ids = {c["id"] for c in two_characters}
    assert stolen_char["id"] in ids
    assert stone["previous_character_id"] == stolen_char["id"]


def test_rick_prime_steal_twice_second_404(client, sample_character):
    r1 = client.post("/api/rick-prime/steal")
    assert r1.status_code == 200
    r2 = client.post("/api/rick-prime/steal")
    assert r2.status_code == 404
