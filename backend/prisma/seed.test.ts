// prisma/seed.test.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔬 TEST seeder (no-op)');
  // You could insert minimal data here if *all* tests expect it,
  // but your current specs do per-test seeding in beforeAll, so leave blank.
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('TEST seed failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
