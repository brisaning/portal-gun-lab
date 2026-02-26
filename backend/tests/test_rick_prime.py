"""
Tests del robo de personajes por Rick Prime.
"""


def test_rick_prime_steal_empty(client):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 404
    assert "No hay personajes" in r.json()["detail"]


def test_rick_prime_steal_returns_character(client, sample_character):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == sample_character["id"]
    assert data["name"] == sample_character["name"]
    assert "current_dimension" in data


def test_rick_prime_steal_removes_from_list(client, sample_character):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 200
    r2 = client.get("/api/characters")
    assert r2.status_code == 200
    assert len(r2.json()) == 0


def test_rick_prime_steal_one_of_many(client, two_characters):
    r = client.post("/api/rick-prime/steal")
    assert r.status_code == 200
    stolen = r.json()
    r2 = client.get("/api/characters")
    remaining = r2.json()
    assert len(remaining) == 1
    assert stolen["id"] != remaining[0]["id"]
    ids = {c["id"] for c in two_characters}
    assert stolen["id"] in ids
    assert remaining[0]["id"] in ids


def test_rick_prime_steal_twice_second_404(client, sample_character):
    r1 = client.post("/api/rick-prime/steal")
    assert r1.status_code == 200
    r2 = client.post("/api/rick-prime/steal")
    assert r2.status_code == 404
