import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma/prisma.client";
import { AuthService } from "@/server/auth/auth.service";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = registerSchema.parse(body);

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "El usuario o email ya existe" }, { status: 400 });
    }

    const passwordHash = await AuthService.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        leaderboard: {
          create: {
            elo: 1000
          }
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
      }
    });

    const token = AuthService.generateToken(user.id);

    return NextResponse.json({
      success: true,
      data: { user, token }
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
