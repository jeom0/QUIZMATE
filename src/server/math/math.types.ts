export interface Point {
  x: number;
  y: number;
}

export interface TrajectoryParams {
  v0: number; // Velocidad inicial (m/s)
  angleDegrees: number; // Ángulo en grados
  g: number; // Gravedad (m/s^2)
  wind?: number; // Viento (m/s)
  direction: 1 | -1; // 1: Derecha, -1: Izquierda
  origin: Point; // Posición inicial
}

export interface TrajectoryResult {
  impactPoint: Point;
  timeOfFlight: number;
  maxHeights: number;
  horizontalRange: number;
  points: Point[]; // Puntos de la trayectoria para el frontend
}

export interface SensitivityAnalysis {
  dRdv: number; // Derivada parcial del alcance respecto a la velocidad
  dRda: number; // Derivada parcial del alcance respecto al ángulo
  dRdg: number; // Derivada parcial del alcance respecto a la gravedad
}

export interface ShotAnalysis {
  trajectory: TrajectoryResult;
  sensitivity: SensitivityAnalysis;
  isHit: boolean;
  distanceToTarget: number;
  damage: number;
  knockback: number; // Distancia que se mueve el objetivo hacia atrás
}
