import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const rainbowColors = [
  { name: "Vermelho", hexCode: "#FF0000" },
  { name: "Laranja", hexCode: "#FFA500" },
  { name: "Amarelo", hexCode: "#FFFF00" },
  { name: "Verde", hexCode: "#008000" },
  { name: "Azul", hexCode: "#0000FF" },
  { name: "Anil", hexCode: "#4B0082" },
  { name: "Violeta", hexCode: "#EE82EE" },
];

async function main(): Promise<void> {
  for (const color of rainbowColors) {
    await prisma.color.upsert({
      where: { name: color.name },
      update: {},
      create: color,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
