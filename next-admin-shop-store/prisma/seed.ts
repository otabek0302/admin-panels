import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('test1234', 10);

  await prisma.user.upsert({
    where: { email: 'test@gmail.com' },
    update: {}, // Do nothing if exists
    create: {
      name: 'Admin',
      email: 'test@gmail.com',
      password,
      role: 'ADMIN',
    },
  });

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
