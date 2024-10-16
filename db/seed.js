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
    const users = await prisma.user.createMany({
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
    const items = await prisma.item.createMany({
      data: [
        { name: 'Olaplex', avgScore: 4.5 },
        { name: 'Moroccan Oil', avgScore: 4.2 },
        { name: 'Phrenology', avgScore: 4.7 },
        { name: 'Amika', avgScore: 4.8 },
        { name: 'Kerastase', avgScore: 4.1 },
      ],
    });

    const allUsers = await prisma.user.findMany();
    const allItems = await prisma.item.findMany();

    // Insert Reviews
    const reviews = [
      {
        text: 'Great shampoo!',
        score: 5,
        userId: allUsers[0].id,
        itemId: allItems[0].id,
      },
      {
        text: 'Very moisturizing',
        score: 4,
        userId: allUsers[1].id,
        itemId: allItems[1].id,
      },
      {
        text: 'Loved it!',
        score: 5,
        userId: allUsers[2].id,
        itemId: allItems[2].id,
      },
      {
        text: 'Okay product',
        score: 3,
        userId: allUsers[3].id,
        itemId: allItems[3].id,
      },
      {
        text: 'Best hair mask ever!',
        score: 5,
        userId: allUsers[4].id,
        itemId: allItems[4].id,
      },
    ];
    await prisma.review.createMany({ data: reviews });

    const allReviews = await prisma.review.findMany();

    // Insert Comments
    const comments = [
      {
        userId: allUsers[0].id,
        reviewId: allReviews[0].id,
        text: 'I agree, it works wonders!',
      },
      {
        userId: allUsers[1].id,
        reviewId: allReviews[1].id,
        text: 'I have a similar experience.',
      },
      {
        userId: allUsers[2].id,
        reviewId: allReviews[2].id,
        text: 'Thanks for the review!',
      },
      {
        userId: allUsers[3].id,
        reviewId: allReviews[3].id,
        text: 'Cannot wait to try this!',
      },
      {
        userId: allUsers[4].id,
        reviewId: allReviews[4].id,
        text: 'Not that great!',
      },
    ];
    await prisma.comment.createMany({ data: comments });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Database initialization error', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
