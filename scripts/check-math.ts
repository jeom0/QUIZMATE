/**
 * SCRIPT DE VALIDACIÓN MATEMÁTICA
 * Ejecuta: npx ts-node scripts/check-math.ts
 */

import { TrajectoryService } from "../src/server/math/trajectory.service";
import { DamageService } from "../src/server/math/damage.service";

console.log("--- VALIDACIÓN DE MOTOR MATEMÁTICO (MATEMÁTICAS 3) ---");

const params = {
  v0: 80,
  angleDegrees: 45,
  g: 9.8,
  direction: 1 as 1,
  origin: { x: 0, y: 0 }
};

console.log("\n1. Probando cálculo de Trayectoria...");
const result = TrajectoryService.calculateTrajectory(params);
console.log(`- Tiempo de vuelo: ${result.timeOfFlight.toFixed(2)}s`);
console.log(`- Alcance horizontal: ${result.horizontalRange.toFixed(2)}m`);
console.log(`- Punto de impacto: (${result.impactPoint.x.toFixed(2)}, ${result.impactPoint.y.toFixed(2)})`);

console.log("\n2. Probando Análisis de Sensibilidad (Derivadas Parciales)...");
const sensitivity = TrajectoryService.calculateSensitivity(params.v0, params.angleDegrees, params.g);
console.log(`- dR/dv (Sensibilidad a velocidad): ${sensitivity.dRdv.toFixed(2)}`);
console.log(`- dR/da (Sensibilidad a ángulo): ${sensitivity.dRda.toFixed(2)}`);
console.log(`- dR/dg (Sensibilidad a gravedad): ${sensitivity.dRdg.toFixed(2)}`);

console.log("\n3. Probando Detección de Impacto y Knockback...");
const target = { x: result.impactPoint.x - 5, y: 0 }; // Objetivo cerca del impacto
const damage = DamageService.calculateDamage(result.impactPoint, target, 100, 40);
const knockback = DamageService.calculateKnockback(1, damage);

console.log(`- Distancia al objetivo: ${DamageService.calculateDistance(result.impactPoint, target).toFixed(2)}m`);
console.log(`- Daño calculado: ${damage}`);
console.log(`- Empuje (Knockback) aplicado: ${knockback.toFixed(2)}m`);

console.log("\n--- VALIDACIÓN COMPLETADA CON ÉXITO ---");
