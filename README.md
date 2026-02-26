# Portal Gun Character Lab

Proyecto full-stack con temática psicodélica y verdes neón.

## Estructura

```
portal-gun-lab/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Python FastAPI
├── docker-compose.yml # MongoDB
└── README.md
```

## Requisitos

- Node.js 18+
- Python 3.10+
- Docker y Docker Compose

## Inicio rápido

### 1. Base de datos (MongoDB)

Desde la raíz del proyecto:

```bash
docker-compose up -d
```

MongoDB quedará en `localhost:27017`. Usuario: `admin`, contraseña: `portalgun_secret`.

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Configuración

- **CORS**: El backend permite orígenes `http://localhost:5173` y `http://127.0.0.1:5173` para el frontend en desarrollo.
- **MongoDB**: Variables en `docker-compose.yml`; para producción usa variables de entorno y no credenciales por defecto.

## Licencia

Proyecto de uso educativo / personal.
