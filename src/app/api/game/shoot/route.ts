/**
 * ENDPOINT AUTORITATIVO DE DISPARO
 * 
 * Este endpoint es el núcleo del backend. El frontend envía los parámetros del disparo
 * y el backend calcula todo el resultado matemático y físico.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma/prisma.client";
import { TrajectoryService } from "@/server/math/trajectory.service";
import { DamageService } from "@/server/math/damage.service";
import { AuthService } from "@/server/auth/auth.service";

export async function POST(req: NextRequest) {
  try {
    // 1. Verificación de autenticación
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
    }

    const { gameId, velocity, angleDegrees, weaponId, direction } = await req.json();

    // 2. Obtener estado de la partida
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (!game || game.status !== "IN_PROGRESS") {
      return NextResponse.json({ success: false, error: "Partida no encontrada o no iniciada" }, { status: 404 });
    }

    // 3. Validar turno
    if (game.currentTurnUserId !== decoded.userId) {
      return NextResponse.json({ success: false, error: "No es tu turno" }, { status: 403 });
    }

    const shooter = game.players.find(p => p.userId === decoded.userId);
    const target = game.players.find(p => p.userId !== decoded.userId);

    if (!shooter || !target) {
      return NextResponse.json({ success: false, error: "Error en los jugadores de la partida" }, { status: 500 });
    }

    // 4. CÁLCULOS MATEMÁTICOS (MATEMÁTICAS 3)
    
    // Trayectoria
    const trajectory = TrajectoryService.calculateTrajectory({
      v0: velocity,
      angleDegrees,
      g: game.gravity,
      wind: game.wind,
      direction: direction as 1 | -1,
      origin: { x: shooter.positionX, y: shooter.positionY }
    });

    // Análisis de Sensibilidad (Derivadas Parciales)
    const sensitivity = TrajectoryService.calculateSensitivity(velocity, angleDegrees, game.gravity);

    // Impacto y Daño
    const weapon = await prisma.weapon.findUnique({ where: { code: weaponId || "spear" } }) || { baseDamage: 30, hitRadius: 40 };
    
    const damage = DamageService.calculateDamage(
      trajectory.impactPoint,
      { x: target.positionX, y: target.positionY },
      weapon.baseDamage,
      (weapon as any).hitRadius
    );

    const isHit = damage > 0;
    
    // Knockback (Empuje solicitado por el usuario)
    const knockback = isHit ? DamageService.calculateKnockback(direction, damage) : 0;

    // 5. ACTUALIZACIÓN DE BASE DE DATOS
    
    const newTargetHealth = Math.max(0, target.health - damage);
    const newTargetPositionX = target.positionX + knockback;

    await prisma.$transaction([
      // Actualizar vida y posición del objetivo
      prisma.gamePlayer.update({
        where: { id: target.id },
        data: { 
          health: newTargetHealth,
          positionX: newTargetPositionX
        }
      }),
      // Guardar el disparo en el historial
      prisma.shot.create({
        data: {
          gameId,
          shooterUserId: shooter.userId,
          targetUserId: target.userId,
          velocity,
          angleDegrees,
          angleRadians: (angleDegrees * Math.PI) / 180,
          direction,
          gravity: game.gravity,
          wind: game.wind,
          originX: shooter.positionX,
          originY: shooter.positionY,
          targetX: target.positionX,
          targetY: target.positionY,
          impactX: trajectory.impactPoint.x,
          impactY: trajectory.impactPoint.y,
          distanceToTarget: DamageService.calculateDistance(trajectory.impactPoint, { x: target.positionX, y: target.positionY }),
          damage,
          isHit,
          mathAnalysisJson: sensitivity as any
        }
      }),
      // Cambiar turno
      prisma.game.update({
        where: { id: gameId },
        data: { 
          currentTurnUserId: target.userId,
          round: { increment: 1 }
        }
      })
    ]);

    // 6. RESPUESTA AL FRONTEND
    return NextResponse.json({
      success: true,
      data: {
        trajectory: trajectory.points,
        impactPoint: trajectory.impactPoint,
        isHit,
        damage,
        knockback,
        newTargetHealth,
        newTargetPositionX,
        sensitivityAnalysis: {
          explanation: "Las derivadas parciales miden la sensibilidad del alcance.",
          values: sensitivity
        }
      }
    });

  } catch (error: any) {
    console.error("Error en shoot route:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
