import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing contacts
  await prisma.contact.deleteMany();

  // Create 100 fake contacts
  const contacts = Array.from({ length: 100 }).map((_, i) => ({
    name: `Contact ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${i + 1}/200/200`,
    lastContactAt: new Date(
      Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30) // last 30 days
    ),
  }));

  await prisma.contact.createMany({ data: contacts });

  console.log('✅ Database seeded with 100 contacts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
