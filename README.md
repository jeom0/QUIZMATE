# 🚀 Guía Definitiva de Integración Frontend - QUIZMATE (Bowmasters Math)

¡Hola equipo de Frontend! 👋

Este documento contiene **toda** la información necesaria para que puedan conectar la interfaz gráfica (UI/Juego) con el backend autoritativo que se ha construido. El backend se encarga de **toda la lógica dura**, la persistencia de datos, la autenticación, el matchmaking y, lo más importante, de calcular las físicas y matemáticas de los proyectiles (basado en los requerimientos de Matemáticas 3).

El objetivo es que el frontend sea lo más "tonto" posible en cuanto a cálculos lógicos: solo debe capturar el *input* del usuario, enviarlo al backend, y **dibujar/animar** las respuestas que este devuelva.

---

## 🛠️ 1. Preparación del Entorno Local

Antes de empezar a codear, necesitan tener el backend corriendo en sus máquinas locales para poder hacer las peticiones. Sigan estos pasos exactos:

### Requisitos previos
- Tener **Node.js** (versión 18 o superior).
- El repositorio del backend clonado: `git clone https://github.com/jeom0/QUIZMATE.git`

### Comandos de Inicialización (Terminal del Backend)

1. **Instalar dependencias**:
   Se recomienda usar `pnpm`, pero si no lo tienen o falla, usen `npm`. El proyecto está configurado para manejar los paquetes modernos.
   ```bash
   npx pnpm install
   # O alternativamente: npm install
   ```

2. **Configurar la Base de Datos Local**:
   El proyecto usa **SQLite** para desarrollo local, por lo que no necesitan instalar PostgreSQL. Para crear la base de datos y generar el cliente de Prisma, ejecuten:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Poblar la Base de Datos (Seed)**:
   Este comando insertará los personajes base (Piloto, Dr. Sick, Arquero) y las armas (Lanza, Bisturí, Poción) para que puedan usarlos en el juego.
   ```bash
   npx prisma db seed
   ```
   *(Nota: si el seed falla, asegúrense de correr `npx pnpm install` primero. El script de seed usa `tsx` internamente).*

4. **Arrancar el Servidor**:
   ```bash
   npx pnpm dev
   ```
   El servidor backend estará escuchando en: **`http://localhost:3000`**

---

## 🧠 2. ¿Qué se construyó en el Backend? (Contexto)

Se implementó un servidor robusto en **Next.js (App Router API)** que actúa como árbitro central del juego. 

**Características principales:**
- **Base de Datos (Prisma + SQLite)**: Almacena usuarios (contraseñas encriptadas con bcryptjs), el histórico de partidas (`Game`), los tickets de emparejamiento (`MatchmakingTicket`) y cada uno de los disparos realizados (`Shot`).
- **Autenticación (JWT)**: Todo el sistema está protegido por tokens.
- **Matchmaking Real**: Un sistema de colas donde el backend espera a que dos jugadores busquen partida y los une bajo un mismo `gameId`.
- **Motor Matemático (Mates 3)**: Un módulo aislado (`src/server/math`) que calcula el movimiento parabólico puro usando ecuaciones paramétricas ($x(t)$ y $y(t)$), y realiza Análisis de Sensibilidad mediante **Derivadas Parciales** para determinar cómo pequeños cambios en la fuerza o ángulo afectan el alcance.

---

## 🔌 3. Guía de Conexión y Endpoints (REST API)

Todas las peticiones deben hacerse hacia `http://localhost:3000/api/...`. Las rutas protegidas requieren que se envíe el header:
`Authorization: Bearer <TU_TOKEN_JWT>`

### A. Autenticación

#### 1. Registro (`POST /api/auth/register`)
- **Body**: `{ "username": "player1", "email": "p1@correo.com", "password": "123456" }`
- **Respuesta Exitosa (200)**: Devuelve el objeto del usuario y el **`token`** JWT. *Guarden este token en `localStorage` o en el estado global (Zustand/Redux).*

#### 2. Login (`POST /api/auth/login`)
- **Body**: `{ "email": "p1@correo.com", "password": "123456" }`
- **Respuesta Exitosa (200)**: Devuelve la info del usuario y el nuevo **`token`**.

### B. Matchmaking (Buscando Oponente)

Cuando el jugador presiona "Jugar" en el menú principal:

#### `POST /api/matchmaking/find`
- **Headers**: Requiere Token JWT.
- **Body**: Vacío `{}`
- **Respuesta de Espera (200)**:
  ```json
  { "success": true, "data": { "status": "QUEUED", "ticketId": "..." } }
  ```
  *(El frontend debe mostrar "Buscando oponente..." y hacer *polling* o esperar el evento de Socket.IO).*

- **Respuesta de Emparejamiento (200)**:
  ```json
  { "success": true, "data": { "status": "MATCHED", "gameId": "cmpxxxx..." } }
  ```
  *(Al recibir `MATCHED`, el frontend debe cambiar la escena a la pantalla de combate y guardar el `gameId`).*

### C. El Flujo de Combate (CORE DEL JUEGO)

El juego es por **turnos**. Cuando sea el turno del jugador local y este suelte el dedo de la pantalla (definiendo fuerza y ángulo):

#### `POST /api/game/shoot`
Este es el endpoint más importante. Envía la intención del disparo al servidor.
- **Headers**: Requiere Token JWT.
- **Body**:
  ```json
  {
    "gameId": "ID_DE_LA_PARTIDA",
    "velocity": 85,       // Número entero o float (Fuerza aplicada)
    "angleDegrees": 45,   // Ángulo de disparo (0 a 90)
    "direction": 1,       // 1 si dispara hacia la derecha, -1 si dispara hacia la izquierda
    "weaponId": "spear"   // ID del arma seleccionada
  }
  ```

- **Respuesta (LO QUE DEBEN ANIMAR)**:
  El backend devolverá TODA la información del disparo. El frontend NO debe calcular la física.
  ```json
  {
    "success": true,
    "data": {
      "trajectory": [
        { "x": 100, "y": 0 },
        { "x": 120, "y": 50 },
        // ... (muchos puntos) ...
        { "x": 500, "y": 0 }
      ],
      "impactPoint": { "x": 500, "y": 0 },
      "isHit": true,
      "damage": 35,
      "knockback": 2.5,
      "newTargetHealth": 65,
      "newTargetPositionX": 502.5,
      "sensitivityAnalysis": {
         // ... Datos de derivadas para mostrar en pantalla con fines pedagógicos ...
      }
    }
  }
  ```

#### 🕹️ Cómo usar esta respuesta en el Frontend (Phaser/React):
1. **Animar Trayectoria**: Tomen el array `data.trajectory` y muevan el sprite del proyectil a lo largo de esos puntos secuencialmente (usando *Tweens* o interpolación).
2. **Impacto Visual**: Cuando la animación llegue al último punto, reproduzcan una animación de explosión en `data.impactPoint`.
3. **Aplicar Daño**: Si `data.isHit` es true, reduzcan la barra de vida del enemigo basándose en `data.newTargetHealth`.
4. **Knockback (Empuje)**: Muevan el sprite del enemigo a la nueva coordenada X (`data.newTargetPositionX`).
5. **UI Educativa**: Muestren en una pequeña ventana de la interfaz la información de `sensitivityAnalysis` (ej. *"Si hubieras tirado con 1 m/s más de fuerza, habrías llegado X metros más lejos"*).

---

## ⚡ 4. Consideraciones Importantes

- **Validaciones de Seguridad**: El servidor validará si realmente es el turno del jugador. Si envían un disparo cuando no es el turno, devolverá un error `403 (No es tu turno)`. Manejen este error en la UI sutilmente.
- **Manejo de Errores General**: Siempre envuelvan las peticiones con `try/catch` y lean la propiedad `error` en caso de que `success` sea `false`.
- **Eje Y Invertido**: Tengan en cuenta que en matemáticas el eje Y sube, pero en motores gráficos (HTML Canvas / Phaser) el eje Y baja (el `(0,0)` está arriba a la izquierda). El backend asume que el suelo es `Y = 0`. El frontend deberá invertir el valor de la coordenada Y al dibujar. Por ejemplo: `renderY = screenHeight - data.y`.

¡Mucho éxito con el desarrollo del cliente visual! Todo el core lógico y matemático ya está validado y es seguro. 🎮🚀
