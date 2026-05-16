# Guía de Integración para el Frontend - QuizMate

Esta guía detalla cómo el equipo de frontend debe conectarse al backend autoritativo para que la integración sea fluida y el juego funcione correctamente.

## 1. Concepto Fundamental: Backend Autoritativo
El frontend **NO** debe calcular trayectorias, daños ni posiciones finales. El frontend es responsable de:
1. Capturar el input del usuario (velocidad y ángulo).
2. Enviar esos datos al backend.
3. Recibir los puntos de la trayectoria y el resultado del impacto.
4. **Animar** lo que el backend dictaminó.

## 2. Flujo de Autenticación
Todos los endpoints protegidos requieren un token JWT en el header `Authorization`.

- **Registro**: `POST /api/auth/register` (username, email, password)
- **Login**: `POST /api/auth/login` (email, password)
- **Header**: `Authorization: Bearer <TOKEN>`

## 3. Matchmaking y Juego
1. **Buscar Partida**: `POST /api/matchmaking/find`
   - Si devuelve `status: "QUEUED"`, muestra una pantalla de carga.
   - Si devuelve `status: "MATCHED"`, guarda el `gameId` y comienza el juego.
2. **Obtener Perfil**: `GET /api/users/profile` para mostrar monedas, victorias y personaje seleccionado.

## 4. El Endpoint de Disparo (`/api/game/shoot`)
Este es el endpoint más importante. Se debe llamar cuando el usuario suelta el proyectil.

**Request Body:**
```json
{
  "gameId": "ID_DE_LA_PARTIDA",
  "velocity": 75.5,
  "angleDegrees": 42,
  "direction": 1, 
  "weaponId": "spear"
}
```

**Response Clave:**
- `trajectory`: Un array de puntos `[{x, y}, ...]` que Phaser debe usar para dibujar la curva.
- `impactPoint`: Coordenadas finales donde debe ocurrir la explosión o animación de impacto.
- `isHit`: Booleano para saber si se debe reproducir la animación de "daño" en el enemigo.
- `damage`: Cantidad de vida a restar en la barra visual.
- `knockback`: **IMPORTANTE**. El frontend debe mover al personaje impactado esta distancia hacia atrás para sincronizarse con el backend.
- `newTargetPositionX`: La nueva coordenada X final del oponente.

## 5. Socket.IO (Tiempo Real)
Para escuchar los movimientos del oponente mientras no es tu turno:
- **Evento**: `game_update`
- El backend notificará cuando el otro jugador dispare para que tú puedas animar su proyectil.

## 6. Recomendaciones de Phaser
- Usa los puntos de `trajectory` para crear un `Path` o mover el sprite mediante un `tweens`.
- No uses la física interna de Phaser para decidir el impacto; úsala solo para efectos visuales secundarios.
