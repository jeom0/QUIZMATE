import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma/prisma.client";

export async function GET(req: NextRequest) {
  try {
    const ranking = await prisma.leaderboard.findMany({
      orderBy: { elo: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            username: true,
            wins: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: ranking
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
