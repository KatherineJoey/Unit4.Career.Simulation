// const { Client } = require('pg');
// const client = new Client({
//   connectionString:
//     process.env.DATABASE_URL || 'postgress://localhost/Haircare_Products',
// });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    // Drop existing data if needed
    await prisma.comment.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.item.deleteMany({});
    await prisma.user.deleteMany({});

    // Insert Users
    await prisma.user.createMany({
      data: [
        {
          email: 'fraline@meldigital.com',
          password: '$2b$10$hashed_password1',
        },
        { email: 'njedwards@meu.com', password: '$2b$10$hashed_password2' },
        { email: 'liudana@botmod.com', password: '$2b$10$hashed_password3' },
        { email: 'sukreinor@kelang.com', password: '$2b$10$hashed_password4' },
        { email: 'cahzer28@fb3s.com', password: '$2b$10$hashed_password5' },
      ],
    });

    // Insert Items
    await prisma.item.createMany({
      data: [
        { name: 'Olaplex', avgScore: 4.5 },
        { name: 'Moroccan Oil', avgScore: 4.2 },
        { name: 'Phrenology', avgScore: 4.7 },
        { name: 'Amika', avgScore: 4.8 },
        { name: 'Kerastase', avgScore: 4.1 },
      ],
    });

    // Insert Reviews
    await prisma.review.createMany({
      data: [
        { text: 'Great shampoo!', score: 5, userId: 1, itemId: 1 },
        { text: 'Very moisturizing', score: 4, userId: 1, itemId: 2 },
        { text: 'Loved it!', score: 5, userId: 2, itemId: 3 },
        { text: 'Okay product', score: 3, userId: 3, itemId: 4 },
        { text: 'Best hair mask ever!', score: 5, userId: 4, itemId: 5 },
      ],
    });

    // Insert Comments
    await prisma.comment.createMany({
      data: [
        { userId: 1, reviewId: 1, text: 'I agree, it works wonders!' },
        { userId: 2, reviewId: 2, text: 'I have a similar experience.' },
        { userId: 3, reviewId: 3, text: 'Thanks for the review!' },
        { userId: 4, reviewId: 4, text: 'Cannot wait to try this!' },
        { userId: 5, reviewId: 5, text: 'Not that great!' },
      ],
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Database initialization error', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
