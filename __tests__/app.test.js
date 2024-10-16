const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = require('./db/index');
const bcrypt = require('bcrypt');
console.log('App loaded:', app);

const prisma = new PrismaClient();

describe('API Endpoints', () => {
  let token;
  let userId;
  //   let hashedPassword;

  beforeAll(async () => {
    try {
      //   const existingUsers = await prisma.user.findMany();
      //   const nextId = existingUsers.length
      //     ? Math.max(...existingUsers.map((user) => user.id)) + 1
      //     : 1;
      //   const userId = 1;
      const hashedPassword = await bcrypt.hash('plain_password', 10);
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
        },
      });
      userId = user.id;

      const loginRes = await request(app)
        .post('/api/login')
        .send({ email: 'test@example.com', password: 'plain_password' });

      token = loginRes.body.token;
    } catch (error) {
      console.error('Error setting up test data:', error);
    }
  });

  afterAll(async () => {
    if (userId) {
      //   try {
      await prisma.user.delete({ where: { id: userId } });
      //   } catch (error) {
      //     console.error('Error deleting user:', error);
    }
    // } else {
    //   console.warn('User was not created; skipping deletion');
    // }
    await prisma.$disconnect();
  });

  test('GET /api/items - should return a list of items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/items/:id - should return a specific item', async () => {
    const newItem = await prisma.item.create({
      data: { name: 'Test Item', avgScore: 4.5 },
    });

    const response = await request(app).get(`/api/items/${newItem.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Item');
  });

  test('GET /api/items/search - should return an item by name', async () => {
    const newItem = await prisma.item.create({
      data: { name: 'Unique Test Item', avgScore: 4.5 },
    });

    const response = await request(app).get(`/api/items/${newItem.name}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Unique Test Item');
  });

  test('POST /api/signup - should create a new user', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({ email: 'newuser@example.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('newuser@example.com');
  });

  test('POST /api/login - should authenticate user and return a token', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'plain_password' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('POST /api/reviews - should create a review', async () => {
    const item = await prisma.item.create({
      data: {
        name: 'Test Item for Review',
        avgScore: 4.5,
      },
    });

    const response = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ itemId: item.id, text: 'Great product!', score: 5 });

    expect(response.status).toBe(201);
    expect(response.body.text).toBe('Great product!');
    expect(response.body.itemId).toBe(item.id);
  });

  test('PUT /api/reviews/:id - should edit an existing review', async () => {
    const review = await prisma.review.create({
      data: {
        text: 'Initial Review',
        score: 4,
        userId,
        itemId: 1,
      },
    });

    const response = await request(app)
      .put(`/api/reviews/${review.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Updated Review', score: 5 });

    expect(response.status).toBe(200);
    expect(response.body.text).toBe('Updated Review');
  });

  test('DELETE /api/reviews/:id - should delete a review', async () => {
    const review = await prisma.review.create({
      data: {
        text: 'Review to Delete',
        score: 4,
        userId,
        itemId: 1,
      },
    });

    const response = await request(app)
      .delete(`/api/reviews/${review.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test('GET /api/reviews/:userId - should return reviews for a specific user', async () => {
    const response = await request(app)
      .get(`/api/reviews/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/comments - should create a comment', async () => {
    const review = await prisma.review.create({
      data: {
        text: 'Great review!',
        score: 5,
        userId,
        itemId: 1,
      },
    });

    const response = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ reviewId: review.id, text: 'I agree with this review!' });

    expect(response.status).toBe(201);
    expect(response.body.text).toBe('I agree with this review!');
  });

  test('PUT /api/comments/:id - should edit a comment', async () => {
    const comment = await prisma.comment.create({
      data: {
        text: 'Initial Comment',
        userId,
        reviewId: 1,
      },
    });

    const response = await request(app)
      .put(`/api/comments/${comment.id}`)
      .set('Authorization', `Bearer${token}`)
      .send({ text: 'Updated Comment' });

    expect(response.status).toBe(200);
    expect(response.body.text).toBe('Updated Comment');
  });

  test('DELETE /api/comments/:id - should delete a comment', async () => {
    const comment = await prisma.comment.create({
      data: {
        text: 'Comment to Delete',
        userId,
        reviewId: 2,
      },
    });
    const response = await request(app)
      .delete(`/api/comments/${comment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test('GET /api/comments/:userId - should return comments for a specific user', async () => {
    const response = await request(app)
      .get(`/api/comments/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
