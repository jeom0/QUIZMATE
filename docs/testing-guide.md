# Guía de Pruebas y Validación - QuizMate

Para asegurar que el backend quedó bien antes de pasarlo al equipo de frontend, sigue estos pasos:

## 1. Verificación de Compilación
Asegúrate de que no haya errores de TypeScript:
```bash
npx tsc --noEmit
```

## 2. Inicialización de la Base de Datos
Prisma debe estar sincronizado. Asegúrate de que tienes una base de datos activa (o cambia a SQLite en `schema.prisma` para pruebas locales rápidas).
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## 3. Prueba de Endpoints con Postman o Thunder Client
Crea una colección con los siguientes pasos:

### Paso A: Registro de Usuario 1
- **URL**: `http://localhost:3000/api/auth/register`
- **Método**: `POST`
- **Body**: `{"username": "player1", "email": "p1@test.com", "password": "password123"}`
- **Resultado esperado**: `success: true` y un token JWT.

### Paso B: Login de Usuario 2
- Realiza lo mismo para un "player2".

### Paso C: Matchmaking
- Envía un `POST` a `/api/matchmaking/find` con el token del Player 1.
- Luego envía lo mismo con el token del Player 2.
- El segundo debería devolver `status: "MATCHED"` y un `gameId`.

### Paso D: Simulación de Disparo (Cálculo Matemático)
- **URL**: `http://localhost:3000/api/game/shoot`
- **Body**: 
  ```json
  {
    "gameId": "EL_ID_QUE_RECIBISTE",
    "velocity": 80,
    "angleDegrees": 45,
    "direction": 1,
    "weaponId": "spear"
  }
  ```
- **Verificación**: 
  1. Revisa que `trajectory` tenga muchos puntos.
  2. Revisa que `sensitivityAnalysis` muestre valores numéricos (las derivadas parciales).
  3. Si hubo impacto, verifica que `knockback` no sea cero.

## 4. Validación de la Documentación LaTeX
Abre el archivo `docs/bowmasters-math.tex`. Si tienes una extensión de LaTeX o usas Overleaf, compílalo para verificar que las fórmulas se ven correctamente. Este es el documento que el profesor evaluará con más rigor.

## 5. Solución de Problemas Comunes
- **Error P1012 de Prisma**: Asegúrate de que no tienes un archivo `prisma.config.ts` si estás usando una versión de Prisma inferior a la 7. He ajustado el proyecto para usar la versión 6, que es más estable para este tipo de configuraciones.
- **Módulo 'dotenv' no encontrado**: Ejecuta `npm install dotenv` si ocurre este error.
