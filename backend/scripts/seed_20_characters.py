#!/usr/bin/env python3
"""
Añade 20 personajes a la base de datos usando la API local.
"""
import json
import sys
import urllib.request

API_BASE = "http://localhost:8000/api"

# 20 personajes temática Rick and Morty (nombre, especie, estado)
CHARACTERS = [
    ("Rick Sanchez", "Human", "alive"),
    ("Morty Smith", "Human", "alive"),
    ("Summer Smith", "Human", "alive"),
    ("Beth Smith", "Human", "alive"),
    ("Jerry Smith", "Human", "alive"),
    ("Birdperson", "Bird-Person", "dead"),
    ("Squanchy", "Cat-Person", "unknown"),
    ("Mr. Meeseeks", "Meeseeks", "unknown"),
    ("Abadango Cluster Princess", "Alien", "alive"),
    ("Abradolf Lincler", "Human", "unknown"),
    ("Adjudicator Rick", "Human", "dead"),
    ("Agency Director", "Human", "dead"),
    ("Alan Rails", "Human", "dead"),
    ("Albert Einstein", "Human", "dead"),
    ("Alexander", "Human", "dead"),
    ("Alien Googah", "Alien", "unknown"),
    ("Alien Morty", "Human", "unknown"),
    ("Amish Cyborg", "Alien", "dead"),
    ("Annie", "Human", "alive"),
    ("Antenna Morty", "Human", "alive"),
]


def post(url, data):
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        url, data=body, method="POST", headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=5) as r:
        raw = r.read().decode()
        return json.loads(raw) if raw else None


def main():
    dimension = "C-137"
    print(f"Añadiendo {len(CHARACTERS)} personajes en dimensión {dimension}...")
    created = 0
    for name, species, status in CHARACTERS:
        payload = {
            "name": name,
            "status": status,
            "species": species,
            "origin_dimension": dimension,
            "current_dimension": dimension,
            "image_url": None,
        }
        try:
            post(f"{API_BASE}/characters", payload)
            created += 1
            print(f"  Creado: {name}")
        except Exception as e:
            print(f"  Error creando {name}: {e}", file=sys.stderr)

    print(f"\nListo. Creados {created} personajes.")


if __name__ == "__main__":
    main()
