"""
Tests de endpoints raíz y health.
"""


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("message") == "Portal Gun Character Lab API"
    assert data.get("status") == "ok"


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "healthy"}


def test_clear_db_returns_200_in_test_env(client):
    r = client.delete("/api/test/clear-db")
    assert r.status_code == 200
    assert "deleted" in r.json()
