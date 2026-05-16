# Prompt completo para Antigravity — Backend Bowmasters educativo con Matemáticas 3

## 0. Contexto general del proyecto

Estoy desarrollando un videojuego web inspirado en **Bowmasters**, pero con enfoque académico para una materia de **Matemáticas 3**. El proyecto tendrá una interfaz visual parecida a un juego 2D por turnos: dos personajes enfrentados, barra de vida superior, disparos parabólicos, pantalla de versus, pantalla de victoria, recompensas, monedas y sistema básico de ranking.

Yo **solo soy responsable del backend**. No debo construir las escenas de Phaser, animaciones, sprites, sonidos ni diseño visual. El frontend consumirá el backend mediante **REST API** y **Socket.IO**.

El backend debe quedar muy bien estructurado, documentado y explicado, porque debo presentarlo al profesor. Además, el código debe tener comentarios extensos en español explicando qué hace cada función, para qué existe y con qué tema de Matemáticas 3 se relaciona.

---

## 1. Stack tecnológico obligatorio

Usa el stack del proyecto:

```txt
Next.js
TypeScript
Next.js API Routes o App Router Route Handlers
Socket.IO
Prisma ORM
PostgreSQL
JWT
bcrypt
Zod para validaciones
Jest o Vitest para pruebas
```

### Regla importante

Antes de programar, revisa la estructura real del proyecto:

- Si el proyecto usa `app/api`, implementa Route Handlers.
- Si el proyecto usa `pages/api`, implementa API Routes.
- No cambies la arquitectura principal sin necesidad.
- No implementes frontend.
- No modifiques Phaser salvo que sea estrictamente necesario para exponer tipos o contratos compartidos.

---

## 2. Objetivo del backend

Construir el backend autoritativo de un juego tipo Bowmasters educativo.

El backend debe encargarse de:

1. Registro e inicio de sesión.
2. Gestión de usuarios.
3. Perfil del jugador.
4. Selección de personaje.
5. Selección de arma.
6. Matchmaking.
7. Creación de sala de juego.
8. Manejo de rooms multiplayer con Socket.IO.
9. Estado de partida.
10. Turnos.
11. Validación de disparos.
12. Cálculo de trayectoria parabólica.
13. Detección de impacto.
14. Cálculo de daño.
15. Actualización de vida.
16. Finalización de partida.
17. Recompensas.
18. Monedas.
19. Ranking.
20. Historial de disparos.
21. Documento LaTeX explicativo.
22. Comentarios extensos en el código.

---

## 3. Idea visual que consumirá el frontend

El frontend tendrá una interfaz similar a un juego 2D por turnos:

- Pantalla lateral 2D con dos personajes.
- Jugador a la izquierda y enemigo a la derecha.
- Barra de vida del jugador 1 y jugador 2 en la parte superior.
- Avatar de cada jugador.
- Indicador de turno.
- Personaje activo.
- Arma activa.
- Trayectoria visual del disparo.
- Tutorial tipo “How to play”.
- Pantalla de versus.
- Pantalla de victoria.
- Recompensa total.
- Monedas.
- Cofres.
- Logros.
- Ranking.

El backend debe proveer datos para que el frontend pueda pintar todo esto.

Ejemplo de estado que el frontend necesita:

```json
{
  "gameId": "game_123",
  "status": "IN_PROGRESS",
  "currentTurnUserId": "user_1",
  "gravity": 9.8,
  "wind": 2,
  "round": 3,
  "players": [
    {
      "userId": "user_1",
      "username": "Player 1",
      "avatarUrl": "/avatars/pilot.png",
      "characterId": "pilot",
      "weaponId": "spear",
      "positionX": 120,
      "positionY": 0,
      "health": 70,
      "maxHealth": 100,
      "isReady": true,
      "isCurrentTurn": true
    },
    {
      "userId": "user_2",
      "username": "Dr. Sick",
      "avatarUrl": "/avatars/scientist.png",
      "characterId": "scientist",
      "weaponId": "scalpel",
      "positionX": 820,
      "positionY": 0,
      "health": 38,
      "maxHealth": 100,
      "isReady": true,
      "isCurrentTurn": false
    }
  ],
  "lastShot": {
    "shotId": "shot_123",
    "shooterUserId": "user_1",
    "velocity": 72,
    "angleDegrees": 42,
    "impactX": 798.4,
    "impactY": 0,
    "damage": 30,
    "isHit": true
  }
}
```

---

## 4. Backend autoritativo

El backend debe ser la fuente de verdad.

### El frontend NO puede decidir:

- Si el disparo impactó.
- Cuánto daño hizo.
- Si el jugador ganó.
- A quién le toca el turno.
- Si una partida terminó.
- Cuántas monedas se entregan.
- Si el usuario sube en el ranking.

### El frontend solo debe enviar:

- `gameId`
- `velocity`
- `angleDegrees`
- `direction`
- `weaponId`

El backend calcula:

- trayectoria;
- punto de impacto;
- distancia al objetivo;
- si golpeó o falló;
- daño;
- cambio de turno;
- vida restante;
- ganador;
- recompensas;
- ranking.

---

## 5. Relación con Matemáticas 3

Este proyecto debe demostrar temas de Matemáticas 3.

El backend debe incluir un módulo matemático que calcule y explique:

1. Funciones de varias variables.
2. Trayectoria parabólica.
3. Derivadas parciales.
4. Análisis de sensibilidad.
5. Distancia euclidiana.
6. Optimización aproximada.
7. Cambio de variables.
8. Interpretación matemática aplicada al juego.

---

## 6. Modelo matemático principal

El disparo se modela como un movimiento parabólico.

### Ecuación de trayectoria

```txt
y = x tan(θ) - (g x² / 2v² cos²(θ))
```

Donde:

- `y`: altura del proyectil.
- `x`: distancia horizontal.
- `θ`: ángulo de lanzamiento.
- `v`: velocidad inicial.
- `g`: gravedad.

### Movimiento paramétrico

```txt
x(t) = x0 + direction * v * cos(θ) * t + wind * t
y(t) = y0 + v * sin(θ) * t - 0.5 * g * t²
```

Donde:

- `x0`: posición inicial del jugador que dispara.
- `y0`: altura inicial del disparo.
- `direction`: dirección del disparo, `1` hacia la derecha y `-1` hacia la izquierda.
- `wind`: viento horizontal simplificado.

### Alcance horizontal

```txt
R(v, θ, g) = v² sin(2θ) / g
```

Esta función debe ser explicada como una **función de varias variables**, porque el alcance depende de velocidad, ángulo y gravedad.

### Derivadas parciales

```txt
∂R/∂v = 2v sin(2θ) / g

∂R/∂θ = 2v² cos(2θ) / g

∂R/∂g = -v² sin(2θ) / g²
```

Interpretación:

- `∂R/∂v`: mide cómo cambia el alcance cuando cambia la velocidad.
- `∂R/∂θ`: mide cómo cambia el alcance cuando cambia el ángulo.
- `∂R/∂g`: mide cómo cambia el alcance cuando cambia la gravedad.

### Distancia euclidiana para impacto

```txt
D = sqrt((xImpact - xTarget)² + (yImpact - yTarget)²)
```

Si `D <= hitRadius`, entonces hay impacto.

---

## 7. Arquitectura esperada del backend

Organiza el código de forma modular.

Estructura sugerida:

```txt
src/
  app/
    api/
      auth/
        register/
          route.ts
        login/
          route.ts
        me/
          route.ts
      users/
        profile/
          route.ts
        ranking/
          route.ts
      characters/
        route.ts
      weapons/
        route.ts
      matchmaking/
        find/
          route.ts
        cancel/
          route.ts
      game/
        create/
          route.ts
        join/
          route.ts
        ready/
          route.ts
        state/
          route.ts
        shoot/
          route.ts
        leave/
          route.ts
      rewards/
        claim/
          route.ts
      achievements/
        route.ts

  server/
    auth/
      auth.service.ts
      auth.types.ts
      auth.validation.ts
      jwt.service.ts
      password.service.ts

    users/
      users.service.ts
      users.types.ts

    characters/
      characters.service.ts
      characters.types.ts

    weapons/
      weapons.service.ts
      weapons.types.ts

    games/
      games.service.ts
      games.types.ts
      games.validation.ts
      turn.service.ts

    matchmaking/
      matchmaking.service.ts
      matchmaking.types.ts

    sockets/
      socket.server.ts
      game.gateway.ts
      socket.types.ts

    math/
      trajectory.service.ts
      derivatives.service.ts
      damage.service.ts
      math.types.ts

    rewards/
      rewards.service.ts
      achievements.service.ts
      rewards.types.ts

    leaderboard/
      leaderboard.service.ts
      leaderboard.types.ts

    prisma/
      prisma.client.ts

    common/
      constants/
      errors/
      responses/
      validation/
      utils/

docs/
  bowmasters-backend-math-documentation.tex
  api-contract.md

prisma/
  schema.prisma
```

Si la estructura real del proyecto es distinta, adapta sin romper el proyecto.

---

## 8. Base de datos con Prisma

Crea o ajusta el archivo `prisma/schema.prisma`.

### Enums necesarios

```prisma
enum GameStatus {
  WAITING
  READY
  IN_PROGRESS
  FINISHED
  CANCELLED
}

enum MatchmakingStatus {
  QUEUED
  MATCHED
  CANCELLED
  EXPIRED
}

enum RewardType {
  COINS
  CHEST
  ACHIEVEMENT
}
```

### Modelo User

```prisma
model User {
  id           String   @id @default(cuid())
  username     String   @unique
  email        String   @unique
  passwordHash String
  wins         Int      @default(0)
  losses       Int      @default(0)
  coins        Int      @default(0)
  selectedCharacterId String?
  selectedWeaponId    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  gamePlayers  GamePlayer[]
  shots         Shot[]
  leaderboard  Leaderboard?
  rewards       Reward[]
  achievements  UserAchievement[]
}
```

### Modelo Character

```prisma
model Character {
  id          String @id @default(cuid())
  code        String @unique
  name        String
  avatarUrl   String?
  baseHealth  Int    @default(100)
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Modelo Weapon

```prisma
model Weapon {
  id          String @id @default(cuid())
  code        String @unique
  name        String
  baseDamage  Int    @default(35)
  hitRadius   Float  @default(35)
  maxVelocity Float  @default(150)
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Modelo Game

```prisma
model Game {
  id                String     @id @default(cuid())
  status            GameStatus @default(WAITING)
  currentTurnUserId String?
  winnerUserId      String?
  gravity           Float      @default(9.8)
  wind              Float      @default(0)
  round             Int        @default(1)
  maxRounds         Int        @default(20)
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt

  players           GamePlayer[]
  shots             Shot[]
  rewards           Reward[]
}
```

### Modelo GamePlayer

```prisma
model GamePlayer {
  id          String   @id @default(cuid())
  gameId      String
  userId      String
  characterId String?
  weaponId    String?
  positionX   Float
  positionY   Float   @default(0)
  health      Int     @default(100)
  maxHealth   Int     @default(100)
  isReady     Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  game        Game @relation(fields: [gameId], references: [id])
  user        User @relation(fields: [userId], references: [id])

  @@unique([gameId, userId])
}
```

### Modelo Shot

```prisma
model Shot {
  id               String   @id @default(cuid())
  gameId           String
  shooterUserId    String
  targetUserId     String
  weaponId         String?
  velocity         Float
  angleDegrees     Float
  angleRadians     Float
  direction        Int
  gravity          Float
  wind             Float
  originX          Float
  originY          Float
  targetX          Float
  targetY          Float
  impactX          Float
  impactY          Float
  distanceToTarget Float
  damage           Int
  isHit            Boolean
  mathAnalysisJson Json?
  createdAt        DateTime @default(now())

  game             Game @relation(fields: [gameId], references: [id])
  shooter          User @relation(fields: [shooterUserId], references: [id])
}
```

### Modelo Leaderboard

```prisma
model Leaderboard {
  id        String   @id @default(cuid())
  userId    String   @unique
  wins      Int      @default(0)
  losses    Int      @default(0)
  elo       Int      @default(1000)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User @relation(fields: [userId], references: [id])
}
```

### Modelo MatchmakingTicket

```prisma
model MatchmakingTicket {
  id        String @id @default(cuid())
  userId    String
  status    MatchmakingStatus @default(QUEUED)
  gameId    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Modelo Reward

```prisma
model Reward {
  id        String @id @default(cuid())
  userId    String
  gameId    String?
  type      RewardType
  amount    Int @default(0)
  claimed   Boolean @default(false)
  reason    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User @relation(fields: [userId], references: [id])
  game      Game? @relation(fields: [gameId], references: [id])
}
```

### Modelo Achievement y UserAchievement

```prisma
model Achievement {
  id          String @id @default(cuid())
  code        String @unique
  name        String
  description String
  coinsReward Int @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       UserAchievement[]
}

model UserAchievement {
  id            String @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())

  user          User @relation(fields: [userId], references: [id])
  achievement   Achievement @relation(fields: [achievementId], references: [id])

  @@unique([userId, achievementId])
}
```

---

## 9. Endpoints REST requeridos

Usa respuestas consistentes.

### Formato de respuesta exitosa

```json
{
  "success": true,
  "data": {}
}
```

### Formato de error

```json
{
  "success": false,
  "error": {
    "code": "NOT_CURRENT_TURN",
    "message": "No es el turno de este jugador."
  }
}
```

---

## 10. Endpoints de autenticación

### `POST /api/auth/register`

Crea un usuario.

Body:

```json
{
  "username": "player1",
  "email": "player1@test.com",
  "password": "123456"
}
```

Debe:

- Validar datos con Zod.
- Verificar email único.
- Verificar username único.
- Hashear password con bcrypt.
- Crear usuario.
- Crear leaderboard inicial.
- Retornar token JWT y usuario sin passwordHash.

---

### `POST /api/auth/login`

Body:

```json
{
  "email": "player1@test.com",
  "password": "123456"
}
```

Debe:

- Validar email y password.
- Comparar contraseña con bcrypt.
- Retornar JWT.
- Retornar usuario sin passwordHash.

---

### `GET /api/auth/me`

Debe:

- Leer token JWT.
- Retornar usuario autenticado.
- No retornar `passwordHash`.

---

## 11. Endpoints de usuario

### `GET /api/users/profile`

Retorna:

```json
{
  "id": "user_1",
  "username": "Player 1",
  "email": "player1@test.com",
  "wins": 3,
  "losses": 1,
  "coins": 420,
  "selectedCharacterId": "pilot",
  "selectedWeaponId": "spear"
}
```

---

### `GET /api/users/ranking`

Retorna ranking ordenado por ELO o victorias.

---

## 12. Endpoints de personajes y armas

### `GET /api/characters`

Retorna personajes disponibles para que el frontend pueda mostrar selección de personaje.

### `GET /api/weapons`

Retorna armas disponibles.

### `POST /api/users/select-character`

Body:

```json
{
  "characterId": "pilot"
}
```

### `POST /api/users/select-weapon`

Body:

```json
{
  "weaponId": "spear"
}
```

---

## 13. Endpoints de matchmaking

### `POST /api/matchmaking/find`

Debe:

- Crear ticket de matchmaking.
- Buscar otro jugador en cola.
- Si existe otro jugador, crear partida.
- Si no existe, dejar al usuario en cola.

Respuesta si queda en cola:

```json
{
  "success": true,
  "data": {
    "status": "QUEUED",
    "ticketId": "ticket_123"
  }
}
```

Respuesta si encontró partida:

```json
{
  "success": true,
  "data": {
    "status": "MATCHED",
    "gameId": "game_123"
  }
}
```

---

### `POST /api/matchmaking/cancel`

Cancela ticket de matchmaking activo.

---

## 14. Endpoints de juego

### `POST /api/game/create`

Crea partida manual.

Body:

```json
{
  "gravity": 9.8,
  "wind": 0
}
```

Debe:

- Crear `Game` en estado `WAITING`.
- Agregar creador como `GamePlayer`.
- Posicionarlo a la izquierda.

---

### `POST /api/game/join`

Body:

```json
{
  "gameId": "game_123"
}
```

Debe:

- Validar usuario autenticado.
- Validar que la partida exista.
- Validar que esté en `WAITING`.
- Validar que no tenga dos jugadores.
- Agregar segundo jugador.
- Posicionarlo a la derecha.
- Cambiar estado a `READY`.

---

### `POST /api/game/ready`

Body:

```json
{
  "gameId": "game_123"
}
```

Debe:

- Marcar jugador como listo.
- Si ambos están listos, iniciar partida.
- Asignar turno inicial.
- Emitir evento `game:start`.

---

### `GET /api/game/state?gameId=game_123`

Retorna estado completo para que el frontend pinte HUD, personajes, barras de vida y turno.

---

### `POST /api/game/shoot`

Endpoint crítico.

Body:

```json
{
  "gameId": "game_123",
  "velocity": 72,
  "angleDegrees": 42,
  "direction": 1,
  "weaponId": "spear"
}
```

Debe:

1. Validar JWT.
2. Validar body con Zod.
3. Validar que la partida exista.
4. Validar que la partida esté en `IN_PROGRESS`.
5. Validar que el usuario pertenezca a la partida.
6. Validar que sea su turno.
7. Validar velocidad permitida.
8. Validar ángulo permitido.
9. Convertir grados a radianes.
10. Calcular trayectoria.
11. Calcular punto de impacto.
12. Calcular distancia al enemigo.
13. Determinar si hubo impacto.
14. Calcular daño.
15. Guardar `Shot`.
16. Actualizar vida del enemigo.
17. Si vida llega a 0, finalizar partida.
18. Si no termina, cambiar turno.
19. Emitir eventos Socket.IO.
20. Retornar resultado completo.

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "shotId": "shot_123",
    "gameId": "game_123",
    "shooterUserId": "user_1",
    "targetUserId": "user_2",
    "velocity": 72,
    "angleDegrees": 42,
    "angleRadians": 0.733,
    "impactX": 798.4,
    "impactY": 0,
    "distanceToTarget": 21.6,
    "isHit": true,
    "damage": 30,
    "targetHealthAfterShot": 38,
    "nextTurnUserId": "user_2",
    "gameStatus": "IN_PROGRESS",
    "mathAnalysis": {
      "mainFunction": "R(v, θ, g) = v² sin(2θ) / g",
      "trajectoryFunction": "y = x tan(θ) - (g x² / 2v² cos²(θ))",
      "range": 510.2,
      "partialDerivatives": {
        "dR_dv": 14.17,
        "dR_dtheta": 380.7,
        "dR_dg": -52.06
      },
      "interpretation": {
        "velocity": "A mayor velocidad inicial, mayor alcance horizontal.",
        "angle": "El ángulo modifica la forma de la parábola y puede acercar o alejar el impacto del objetivo.",
        "gravity": "A mayor gravedad, menor alcance horizontal."
      }
    }
  }
}
```

---

## 15. Socket.IO requerido

Implementar eventos para tiempo real.

Cada partida debe usar una room:

```txt
game:{gameId}
```

### Cliente → Servidor

```txt
player:ready
player:shoot
player:move
player:disconnect
game:join
game:leave
```

### Servidor → Cliente

```txt
game:start
game:update
turn:change
shot:accepted
shot:trajectory
shot:result
player:hit
player:dead
game:end
reward:granted
error
```

### Evento `player:shoot`

Input:

```json
{
  "gameId": "game_123",
  "velocity": 72,
  "angleDegrees": 42,
  "direction": 1,
  "weaponId": "spear"
}
```

Debe ejecutar la misma lógica del endpoint `/api/game/shoot`. No duplicar lógica. Reutilizar `games.service.ts` o `shots.service.ts`.

---

## 16. Módulo matemático obligatorio

Crear módulo aislado.

```txt
src/server/math/trajectory.service.ts
src/server/math/derivatives.service.ts
src/server/math/damage.service.ts
src/server/math/math.types.ts
```

### Funciones mínimas

```ts
calculateAngleRadians(angleDegrees: number): number

calculateTrajectoryPoint(input: TrajectoryPointInput): TrajectoryPoint

calculateTrajectorySamples(input: TrajectorySamplesInput): TrajectoryPoint[]

calculateRange(input: RangeInput): number

calculateImpactPoint(input: ImpactPointInput): ImpactPoint

calculateDistanceToTarget(input: DistanceToTargetInput): number

calculateIsHit(distanceToTarget: number, hitRadius: number): boolean

calculatePartialDerivatives(input: PartialDerivativesInput): PartialDerivatives

calculateDamage(input: DamageInput): number
```

### Tipos esperados

```ts
export type TrajectoryPoint = {
  time: number
  x: number
  y: number
}

export type PartialDerivatives = {
  dR_dv: number
  dR_dtheta: number
  dR_dg: number
}

export type MathAnalysis = {
  mainFunction: string
  trajectoryFunction: string
  range: number
  partialDerivatives: PartialDerivatives
  interpretation: {
    velocity: string
    angle: string
    gravity: string
  }
}
```

---

## 17. Comentarios extensos obligatorios en el código

Agregar comentarios JSDoc en español para cada función importante.

Ejemplo obligatorio de estilo:

```ts
/**
 * Calcula el alcance horizontal de un proyectil usando un modelo parabólico ideal.
 *
 * Finalidad dentro del juego:
 * Esta función permite estimar hasta dónde llegará el arma lanzada por el jugador.
 * El resultado se usa para calcular el punto de impacto y decidir si el disparo
 * golpea o no al oponente.
 *
 * Relación con Matemáticas 3:
 * El alcance se modela como una función de varias variables:
 * R(v, θ, g) = v² sin(2θ) / g
 *
 * Esta función permite explicar derivadas parciales, porque el alcance cambia
 * cuando se modifica la velocidad inicial, el ángulo o la gravedad.
 *
 * Parámetros:
 * - velocity: velocidad inicial del disparo.
 * - angleRadians: ángulo convertido a radianes.
 * - gravity: gravedad del escenario.
 *
 * Retorna:
 * - Alcance horizontal aproximado.
 */
export function calculateRange(input: RangeInput): number {
  // implementation
}
```

Cada servicio debe explicar su finalidad.

Cada endpoint debe tener comentarios que expliquen:

- Qué recibe.
- Qué valida.
- Qué retorna.
- Qué parte del juego consume ese endpoint.

---

## 18. Validaciones obligatorias

Usa Zod.

### Reglas

```txt
velocity: mínimo 1, máximo 150
angleDegrees: mínimo 1, máximo 89
gravity: mínimo 1, máximo 30
wind: mínimo -30, máximo 30
health: mínimo 0, máximo 100
direction: solo 1 o -1
```

Si algo es inválido, responder con error claro.

Ejemplo:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SHOT_INPUT",
    "message": "La velocidad debe estar entre 1 y 150."
  }
}
```

---

## 19. Sistema de daño

Crear función:

```ts
calculateDamage(input: DamageInput): number
```

Modelo sugerido:

```txt
damage = maxDamage * max(0, 1 - distanceToTarget / hitRadius)
```

Reglas:

- Si `distanceToTarget = 0`, el daño es máximo.
- Si `distanceToTarget > hitRadius`, el daño es 0.
- Redondear el daño a entero.
- Limitar daño entre 0 y `maxDamage`.
- Si el disparo no impacta, daño 0.

Agregar comentario explicando que es un modelo educativo simplificado.

---

## 20. Sistema de turnos

Crear servicio:

```txt
src/server/games/turn.service.ts
```

Funciones:

```ts
validateTurn(gameId: string, userId: string): Promise<void>
changeTurn(gameId: string): Promise<string>
```

Debe garantizar:

- Un jugador no puede disparar dos veces seguidas.
- Solo puede disparar el jugador que tiene el turno.
- Si la partida terminó, nadie puede disparar.
- Si un jugador no pertenece a la partida, no puede interactuar.

---

## 21. Sistema de recompensas

El frontend tiene pantallas de victoria, monedas, cofres y logros. El backend debe soportar eso.

### Al terminar partida

Si gana un jugador:

- sumar victoria al ganador;
- sumar derrota al perdedor;
- actualizar ranking;
- calcular monedas;
- desbloquear logro si aplica;
- generar reward.

Ejemplo de reward:

```json
{
  "type": "COINS",
  "amount": 120,
  "reason": "FIRST_WIN"
}
```

### Logros mínimos

Crear seed o catálogo básico:

```txt
FIRST_WIN: Primera victoria
FIRST_HIT: Primer impacto
PERFECT_SHOT: Impacto con distancia menor a 5
THREE_WINS: Tres victorias acumuladas
```

---

## 22. Seguridad obligatoria

Implementar:

1. JWT.
2. bcrypt.
3. Validación con Zod.
4. No retornar `passwordHash`.
5. Verificar usuario autenticado.
6. Verificar pertenencia a partida.
7. Validar turno.
8. Validar estado de partida.
9. No aceptar daño desde frontend.
10. No aceptar `isHit` desde frontend.
11. No aceptar `winnerUserId` desde frontend.
12. Rate limit básico para disparos si es posible.
13. Manejo consistente de errores.

---

## 23. Pruebas requeridas

Crear pruebas para el backend, mínimo para el motor matemático.

### Tests mínimos

1. Conversión grados a radianes.
2. Cálculo de alcance.
3. Cálculo de trayectoria.
4. Cálculo de distancia al objetivo.
5. Detección de impacto.
6. Cálculo de daño.
7. Derivadas parciales.
8. Validación de turno.
9. Rechazo de velocidad inválida.
10. Rechazo de ángulo inválido.

Ejemplo:

```txt
Given velocity 70, angle 45°, gravity 9.8
When calculateRange is called
Then range must be greater than zero
And dR/dv must be greater than zero
```

---

## 24. Documento LaTeX obligatorio

Crear archivo:

```txt
docs/bowmasters-backend-math-documentation.tex
```

Debe estar en español, bien redactado y listo para compilar.

### Debe incluir:

1. Portada.
2. Introducción.
3. Objetivo del proyecto.
4. Objetivo del backend.
5. Arquitectura general.
6. Stack tecnológico.
7. Responsabilidades del backend.
8. Flujo general del juego.
9. Explicación de endpoints.
10. Explicación de eventos Socket.IO.
11. Modelo de base de datos.
12. Explicación de cada módulo.
13. Explicación de funciones principales.
14. Física del disparo.
15. Función de varias variables.
16. Derivadas parciales.
17. Análisis de sensibilidad.
18. Distancia euclidiana.
19. Sistema de daño.
20. Sistema de turnos.
21. Seguridad.
22. Pruebas.
23. Conclusión.

### Funciones que deben explicarse en el documento

```txt
registerUser()
loginUser()
getAuthenticatedUser()
getUserProfile()
createGame()
joinGame()
markPlayerReady()
startGame()
getGameState()
validateTurn()
launchShot()
calculateAngleRadians()
calculateTrajectoryPoint()
calculateTrajectorySamples()
calculateRange()
calculateImpactPoint()
calculateDistanceToTarget()
calculateIsHit()
calculatePartialDerivatives()
calculateDamage()
changeTurn()
finishGame()
calculateRewards()
unlockAchievements()
updateLeaderboard()
```

Para cada función explicar:

- Qué hace.
- Por qué existe.
- Qué datos recibe.
- Qué retorna.
- Qué parte del frontend la consume.
- Qué tema de Matemáticas 3 aplica, si corresponde.

---

## 25. Plantilla mínima para el documento LaTeX

El archivo `.tex` debe partir de esta estructura:

```latex
\documentclass[12pt]{article}
\usepackage[spanish]{babel}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}
\usepackage{geometry}
\usepackage{hyperref}
\geometry{margin=2.5cm}

\title{Documentación del Backend \\ Bowmasters Educativo con Matemáticas 3}
\author{Nombre del estudiante}
\date{\today}

\begin{document}

\maketitle
\tableofcontents
\newpage

\section{Introducción}
Explicar que el proyecto es un videojuego web inspirado en Bowmasters, con gameplay por turnos y disparos parabólicos.

\section{Objetivo del Backend}
Explicar que el backend administra usuarios, partidas, turnos, disparos, impactos, daño, recompensas y persistencia.

\section{Relación con Matemáticas 3}
Explicar funciones de varias variables, derivadas parciales, análisis de sensibilidad, distancia euclidiana y trayectoria parabólica.

\section{Modelo Matemático del Disparo}
\[
y = x\tan(\theta) - \frac{g x^2}{2v^2\cos^2(\theta)}
\]

\section{Función de Alcance}
\[
R(v,\theta,g)=\frac{v^2\sin(2\theta)}{g}
\]

\section{Derivadas Parciales}
\[
\frac{\partial R}{\partial v}=\frac{2v\sin(2\theta)}{g}
\]

\[
\frac{\partial R}{\partial \theta}=\frac{2v^2\cos(2\theta)}{g}
\]

\[
\frac{\partial R}{\partial g}=-\frac{v^2\sin(2\theta)}{g^2}
\]

\section{Detección de Impacto}
\[
D = \sqrt{(x_{impacto}-x_{objetivo})^2 + (y_{impacto}-y_{objetivo})^2}
\]

\section{Conclusión}
Explicar que el backend conecta programación, videojuegos y Matemáticas 3.

\end{document}
```

Pero no dejarlo solo con esta plantilla. Debe desarrollarse completo en lenguaje natural.

---

## 26. Documento adicional de contrato API

Crear:

```txt
docs/api-contract.md
```

Debe explicar al equipo frontend:

- Endpoints disponibles.
- Eventos Socket.IO.
- Payloads de entrada.
- Respuestas esperadas.
- Errores comunes.
- Estado de partida.
- Cómo consumir `game:update`.
- Cómo consumir `shot:result`.
- Cómo mostrar vida, turno, daño y victoria.

---

## 27. README obligatorio

Actualizar o crear `README.md` con:

1. Descripción del backend.
2. Tecnologías usadas.
3. Instalación.
4. Variables de entorno.
5. Comandos Prisma.
6. Cómo correr migraciones.
7. Cómo correr seed.
8. Cómo correr tests.
9. Cómo iniciar servidor.
10. Endpoints principales.
11. Eventos Socket.IO.
12. Explicación matemática resumida.
13. Cómo compilar el documento LaTeX.

Variables de entorno:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bowmasters"
JWT_SECRET="change_this_secret"
JWT_EXPIRES_IN="7d"
```

---

## 28. Seeds requeridos

Crear seed básico para:

- personajes;
- armas;
- logros.

Ejemplo personajes:

```txt
pilot
scientist
warrior
archer
```

Ejemplo armas:

```txt
spear
axe
rocket
knife
```

No usar assets reales protegidos. Solo códigos y nombres genéricos.

---

## 29. Reglas de calidad

Antes de terminar, verificar:

- El backend compila sin errores.
- No hay `any`.
- No hay lógica matemática dentro de los route handlers.
- Las fórmulas están en el módulo `math`.
- Los endpoints validan entrada.
- Los sockets validan entrada.
- Las respuestas son consistentes.
- El password nunca se retorna.
- El daño nunca viene del frontend.
- El impacto nunca viene del frontend.
- El ganador nunca viene del frontend.
- El turno se valida en backend.
- El documento LaTeX existe.
- El README existe.
- El contrato API existe.
- Hay tests del motor matemático.
- Hay comentarios extensos en español.

---

## 30. Entregables finales esperados

Al finalizar, deben existir:

```txt
1. Backend funcional con Next.js API Routes o Route Handlers.
2. Prisma schema completo.
3. Migraciones Prisma.
4. Seed de personajes, armas y logros.
5. Auth con JWT y bcrypt.
6. Endpoints de usuario.
7. Endpoints de matchmaking.
8. Endpoints de juego.
9. Socket.IO configurado.
10. Rooms multiplayer por partida.
11. Motor matemático aislado.
12. Sistema de daño.
13. Sistema de turnos.
14. Sistema de recompensas.
15. Ranking.
16. Tests del motor matemático.
17. README.md.
18. docs/api-contract.md.
19. docs/bowmasters-backend-math-documentation.tex.
20. Comentarios extensos en español dentro del código.
```

---

## 31. Mensaje final esperado de Antigravity

Cuando termines, responde con:

1. Qué archivos creaste.
2. Qué archivos modificaste.
3. Qué endpoints quedaron disponibles.
4. Qué eventos Socket.IO quedaron disponibles.
5. Cómo correr el backend.
6. Cómo correr migraciones.
7. Cómo correr tests.
8. Cómo compilar el LaTeX.
9. Qué parte del código conecta con Matemáticas 3.
10. Qué queda pendiente si algo no se pudo completar.

No digas solamente “done”. Necesito una explicación clara para poder defender el backend ante el profesor.
