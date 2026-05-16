# QuizMate - Backend Bowmasters Educativo (Matemáticas 3)

Este proyecto es un backend autoritativo para un juego tipo Bowmasters, diseñado para demostrar conceptos avanzados de **Matemáticas 3**.

## Características Principales

- **Motor de Trayectoria Autoritativo**: El backend calcula la trayectoria parabólica completa y el punto de impacto para evitar trampas en el cliente.
- **Análisis de Sensibilidad**: Utiliza derivadas parciales para analizar cómo afectan los cambios en la velocidad y el ángulo al alcance del proyectil.
- **Dinámica de Knockback**: Implementa una lógica de empuje donde el jugador impactado se mueve hacia atrás proporcionalmente al daño recibido.
- **Multiplayer en Tiempo Real**: Soporte para Socket.IO para sincronización de partidas.
- **Autenticación Segura**: Registro e inicio de sesión con JWT y bcrypt.

## Relación con Matemáticas 3

El código incluye comentarios extensos explicando la aplicación de:
1. **Funciones Vectoriales**: Modelado de la trayectoria.
2. **Derivadas Parciales**: Cálculo de la sensibilidad del alcance horizontal.
3. **Distancia Euclidiana**: Detección de colisiones.
4. **Optimización**: Análisis de puntos críticos para el alcance máximo.

## Requisitos Técnicos

- Node.js 18+
- PostgreSQL (o cambiar provider a `sqlite` en `prisma/schema.prisma`)

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar base de datos en `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/quizmate"
   JWT_SECRET="tu_secreto_matematico"
   ```

3. Sincronizar base de datos y semilla:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Documentación para el Profesor

El archivo LaTeX con las explicaciones formales se encuentra en:
`docs/bowmasters-math.tex`

---
Desarrollado para el proyecto final de Matemáticas 3.
