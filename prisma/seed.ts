import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Personajes
  const characters = [
    { code: "pilot", name: "El Piloto", avatarUrl: "/avatars/pilot.png", baseHealth: 100 },
    { code: "scientist", name: "Dr. Sick", avatarUrl: "/avatars/scientist.png", baseHealth: 100 },
    { code: "archer", name: "Arquero Matemático", avatarUrl: "/avatars/archer.png", baseHealth: 100 },
  ];

  for (const char of characters) {
    await prisma.character.upsert({
      where: { code: char.code },
      update: {},
      create: char,
    });
  }

  // Armas
  const weapons = [
    { code: "spear", name: "Lanza de Newton", baseDamage: 35, hitRadius: 40 },
    { code: "scalpel", name: "Bisturí de Gauss", baseDamage: 25, hitRadius: 20 },
    { code: "potion", name: "Poción Derivada", baseDamage: 45, hitRadius: 60 },
  ];

  for (const weapon of weapons) {
    await prisma.weapon.upsert({
      where: { code: weapon.code },
      update: {},
      create: weapon,
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
