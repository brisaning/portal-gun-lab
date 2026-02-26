# PLAN DE TRABAJO PARA CURSOR
## FASE 1: Configuración Inicial del Proyecto

### Prompt 1: Estructura base del proyecto
    text

    Como experto en desarrollo full-stack, ayúdame a crear la estructura inicial del proyecto "Portal Gun Character Lab" con las siguientes características:

    - Frontend: React con Vite (TypeScript)
    - Backend: Python FastAPI
    - Base de datos: MongoDB en Docker
    - Estilo: Temática psicodélica con verdes neón

    Crea la siguiente estructura de carpetas y archivos base:

    portal-gun-lab/
    ├── frontend/
    ├── backend/
    ├── docker-compose.yml
    └── README.md

    Incluye los archivos de configuración inicial para cada parte:
    1. Docker Compose para MongoDB
    2. package.json básico para frontend
    3. requirements.txt para backend
    4. Configuración de CORS en FastAPI

## ## FASE 2: Configuración de MongoDB con Docker

### Prompt 2: Setup de MongoDB
    text

    Configura el docker-compose.yml para MongoDB con:
    - Puerto 27017
    - Volumen persistente para datos
    - Autenticación básica
    - Mongo Express para administración visual (puerto 8081)

    Además, crea un script de inicialización en backend/app/database.py que:
    1. Establezca conexión con MongoDB usando motor asíncrono
    2. Defina la colección "characters"
    3. Incluya manejo de errores y reconexión

## FASE 3: Backend - Modelos y Endpoints

### Prompt 3: Modelos de datos y esquemas
    text

    Crea los modelos Pydantic y esquemas de MongoDB para los personajes:

    En backend/app/models.py:
    - Character: id, name, status, species, origin_dimension, current_dimension, image_url, captured_at
    - Dimension: id, name, description

    En backend/app/schemas.py:
    - CharacterCreate, CharacterUpdate, CharacterResponse
    - Dimension schemas correspondientes

    Implementa validaciones y tipos adecuados

### Prompt 4: Endpoints RESTful
    text

    Desarrolla los endpoints REST en backend/app/routes/characters.py:

    GET /api/characters - Listar todos los personajes (con filtro por dimensión)
    POST /api/characters - Crear nuevo personaje
    PUT /api/characters/{id} - Actualizar personaje (cambiar dimensión)
    DELETE /api/characters/{id} - Eliminar personaje

    POST /api/characters/{id}/move - Endpoint específico para mover entre dimensiones
    GET /api/insults/random - Endpoint para obtener insulto aleatorio
    POST /api/rick-prime/steal - Endpoint para que Rick Prime robe un personaje aleatorio

    Incluye manejo de errores y logging

### Prompt 5: Insultos de Rick y lógica de Rick Prime
    text

    Implementa la lógica de negocio:

    En backend/app/services/insult_service.py:
    - Lista de 20+ insultos típicos de Rick
    - Función para obtener insulto aleatorio

    En backend/app/services/rick_prime_service.py:
    - Lógica para seleccionar personaje aleatorio
    - Reemplazo con "piedra dimensional" (objeto especial)
    - Actualización de base de datos

    En backend/app/routes/rick_routes.py:
    - Endpoints para interactuar con estos servicios

## FASE 4: Frontend - Configuración y Componentes Base

### Prompt 6: Setup inicial de React
    text

    Configura el frontend con React + TypeScript + Vite:

    1. Instala dependencias necesarias:
    - @dnd-kit/sortable (para drag & drop)
    - axios
    - react-router-dom
    - styled-components o tailwindcss (para estilos psicodélicos)
    - react-hot-toast (para notificaciones)

    2. Configura el tema global con:
    - Colores: verde neón (#00ff00, #39ff14, #7cfc00)
    - Fondos con gradientes animados
    - Fuentes redondeadas (Poppins, Quicksand)

    3. Crea el Layout principal con Header y Footer

### Prompt 7: Componentes de Dimensiones y Drag & Drop
    text

    Implementa el sistema de columnas (dimensiones) con drag & drop:

    En frontend/src/components/DimensionColumn.tsx:
    - Columna visual para cada dimensión
    - Lista de personajes usando @dnd-kit/sortable
    - Estilos psicodélicos con hover effects

    En frontend/src/components/CharacterCard.tsx:
    - Tarjeta de personaje con imagen, nombre y especie
    - Animaciones al arrastrar
    - Indicador visual de dimensión de origen

    En frontend/src/hooks/useDimensions.ts:
    - Hook personalizado para manejar estado de dimensiones
    - Lógica de drag & drop con validaciones
    - Integración con backend API

## FASE 5: Integración y Funcionalidades Especiales

### Prompt 8: Conexión Frontend-Backend
    text

    Crea los servicios de API en frontend/src/services/:

    api.ts - Configuración base de axios con interceptors
    characterService.ts - Funciones para CRUD de personajes
    insultService.ts - Llamada al endpoint de insultos
    rickPrimeService.ts - Llamada al endpoint de Rick Prime

    Implementa manejo de errores global y loading states

### Prompt 9: Funcionalidad de Insultos y Notificaciones
    text

    Implementa el sistema de insultos de Rick:

    1. En CharacterCard.tsx, al soltar un personaje:
    - Llamar al endpoint de insulto aleatorio
    - Mostrar toast con el insulto y animación

    2. Crea un componente NotificationToast.tsx personalizado:
    - Estilo psicodélico con bordes neón
    - Animación de entrada/salida
    - Texto verde neón sobre fondo oscuro

### Prompt 10: Rick Prime Feature
    text

    Implementa el feature de Rick Prime:

    1. Botón flotante "Rick Prime Attack" en la UI
    2. Al hacer click:
    - Llamar al endpoint POST /api/rick-prime/steal
    - Mostrar animación de "robo"
    - Actualizar UI: reemplazar personaje con "piedra dimensional"
    - Mostrar insulto especial de Rick Prime

    3. La "piedra dimensional" debe:
    - Tener apariencia de roca con brillos verdes
    - No ser arrastrable
    - Poder ser reemplazada por personajes nuevos

## FASE 6: Testing y Calidad

### Prompt 11: Tests Backend
    text

    Crea tests para el backend usando pytest:

    En backend/tests/:
    test_characters.py - Tests CRUD de personajes
    test_moves.py - Tests de movimiento entre dimensiones
    test_rick_prime.py - Tests de robo de personajes
    test_insults.py - Tests de generación de insultos

    Incluye fixtures de MongoDB para testing y coverage > 80%

### Prompt 12: Tests Frontend
    text

    Implementa tests para el frontend:

    1. Configura Vitest y Testing Library
    2. Tests de componentes:
    - DimensionColumn.test.tsx
    - CharacterCard.test.tsx
    - RickPrimeButton.test.tsx
    3. Tests de integración:
    - Flujo de drag & drop
    - Llamadas API mockeadas
    - Actualización de UI después de movimientos

## FASE 7: Estilos y UX

### Prompt 13: Estilos psicodélicos avanzados
    text

    Mejora los estilos con efectos psicodélicos:

    1. Animaciones de fondo:
    - Gradientes móviles en CSS
    - Efecto "portal" en las dimensiones

    2. Efectos hover:
    - Brillo neón en tarjetas
    - Transiciones suaves

    3. Modo oscuro por defecto con acentos verde neón

    4. Micro-interacciones:
    - Efecto "glitch" en insultos
    - Animación de "portal" al mover personajes

### Prompt 14: Optimización y Performance
    text

    Optimiza la aplicación:

    1. Implementa React.memo en componentes pesados
    2. Virtualización de listas largas
    3. Caché de imágenes de personajes
    4. Lazy loading de componentes pesados
    5. Debounce en llamadas API de movimiento

## FASE 8: Despliegue y Documentación

### Prompt 15: Configuración de producción y documentación
    text

    Prepara la aplicación para producción:

    1. Configuración de Docker multi-stage para frontend y backend
    2. Variables de entorno para producción
    3. Scripts de backup de MongoDB
    4. Documentación API con Swagger/OpenAPI
    5. README completo con instrucciones de instalación
    6. Script de seed inicial con personajes de ejemplo

