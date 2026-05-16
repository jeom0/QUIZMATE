import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma/prisma.client";
import { AuthService } from "@/server/auth/auth.service";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = AuthService.verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        wins: true,
        losses: true,
        coins: true,
        selectedCharacterId: true,
        selectedWeaponId: true
      }
    });

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
