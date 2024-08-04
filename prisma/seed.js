const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'securepassword',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      password: 'anothersecurepassword',
    },
  });

  // Create listings
  const listing1 = await prisma.listing.create({
    data: {
      title: 'Beautiful Beach House',
      description: 'A lovely house by the beach.',
      price: 250,
      imageUrl: 'https://example.com/image.jpg',
      listerName: 'John Doe',
      userId: user1.id,
      reviews: {
        create: [
          {
            rating: 5,
            comment: 'Amazing place! Loved it.',
          },
          {
            rating: 4,
            comment: 'Great location, very clean.',
          },
        ],
      },
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      title: 'Cozy Mountain Cabin',
      description: 'A cozy cabin in the mountains.',
      price: 150,
      imageUrl: 'https://example.com/cabin.jpg',
      listerName: 'Jane Doe',
      userId: user2.id,
      reviews: {
        create: [
          {
            rating: 5,
            comment: 'Perfect getaway!',
          },
          {
            rating: 4,
            comment: 'Lovely place, will visit again.',
          },
        ],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
