"""
Tests de generación de insultos aleatorios.
"""
from unittest.mock import patch

from app.services.insult_service import INSULTS, get_random_insult


def test_insults_random_endpoint(client):
    r = client.get("/api/insults/random")
    assert r.status_code == 200
    data = r.json()
    assert "insult" in data
    assert isinstance(data["insult"], str)
    assert len(data["insult"]) > 0


def test_insults_random_value_in_list(client):
    r = client.get("/api/insults/random")
    assert r.status_code == 200
    assert r.json()["insult"] in INSULTS


def test_get_random_insult_returns_string():
    result = get_random_insult()
    assert isinstance(result, str)
    assert result in INSULTS


@patch("app.services.insult_service.random.choice")
def test_get_random_insult_uses_list(mock_choice):
    mock_choice.return_value = INSULTS[0]
    assert get_random_insult() == INSULTS[0]
    mock_choice.assert_called_once_with(INSULTS)
