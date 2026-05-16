/**
 * SERVICIO DE DAÑO Y COLISIÓN - MATEMÁTICAS 3
 * 
 * Este servicio implementa la detección de impacto y el cálculo de daño.
 * Temas relacionados:
 * 1. Distancia Euclidiana: D = sqrt((x2-x1)^2 + (y2-y1)^2)
 * 2. Modelado de funciones de daño: El daño disminuye linealmente o exponencialmente según la distancia.
 * 3. Vectores: El empuje (knockback) es una traslación del vector posición del objetivo.
 */

import { Point } from "./math.types";

export class DamageService {
  /**
   * Calcula la distancia entre el punto de impacto y el objetivo.
   * Utiliza la norma euclidiana.
   */
  static calculateDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * Determina el daño basado en la cercanía del impacto.
   * Si la distancia es mayor al radio de impacto, el daño es 0.
   */
  static calculateDamage(impact: Point, target: Point, baseDamage: number, hitRadius: number): number {
    const distance = this.calculateDistance(impact, target);

    if (distance > hitRadius) return 0;

    // El daño es máximo en el centro y disminuye hacia los bordes del radio
    // Proporción = 1 - (distancia / radio)
    const factor = 1 - distance / hitRadius;
    return Math.round(baseDamage * factor);
  }

  /**
   * Calcula el empuje (knockback).
   * Según el requerimiento: "cada vez que golpeo a el otro jugador este se corre hacia atras lastimado".
   * 
   * @param direction Dirección del disparo (1 o -1)
   * @param damage Daño recibido
   * @returns Distancia a mover el objetivo
   */
  static calculateKnockback(direction: number, damage: number): number {
    // El empuje es proporcional al daño recibido
    // factor_empuje = damage * 0.5 (ejemplo)
    return direction * (damage * 0.8);
  }
}
