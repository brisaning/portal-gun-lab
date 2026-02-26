# Tests del Backend

## Requisitos

- MongoDB en ejecución. Desde la raíz del proyecto: `docker-compose up -d`.
- Base de datos de test: se usa `portal_gun_lab_test` (variable de entorno `MONGO_DB_NAME`).

## Ejecutar tests

Desde la carpeta `backend/`:

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
MONGO_DB_NAME=portal_gun_lab_test python -m pytest tests/ -v
```

## Coverage

Para generar informe de cobertura (objetivo > 80 %):

```bash
MONGO_DB_NAME=portal_gun_lab_test python -m pytest tests/ -v --cov=app --cov-report=term-missing --cov-fail-under=80
```

## Estructura

- `tests/conftest.py`: fixtures (cliente HTTP, limpieza de DB, personajes de ejemplo).
- `tests/test_characters.py`: CRUD de personajes.
- `tests/test_moves.py`: movimiento entre dimensiones.
- `tests/test_rick_prime.py`: robo de Rick Prime.
- `tests/test_insults.py`: insultos aleatorios.

El endpoint `DELETE /api/test/clear-db` solo existe cuando `MONGO_DB_NAME=portal_gun_lab_test` y limpia la colección antes de cada test.
