import { PrismaClient } from '@prisma/client';
import { QUOTES } from '../src/common/game.constant';

export async function seedQuotes(prisma: PrismaClient): Promise<void> {
  await prisma.quote.createMany({
    data: QUOTES.map((text) => ({
      active: true,
      text,
    })),
  });
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedQuotes(prisma);
    console.log(`${QUOTES.length} quotes added.`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
