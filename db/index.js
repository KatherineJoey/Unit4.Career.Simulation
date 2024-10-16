const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// middleware for user authentication

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Public routes (Any User)
// Browse and read reviews of items
app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        reviews: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
      },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View details, rating, and information of a specific item
app.get('/api/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: {
        reviews: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
      },
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search for items by name or keyword
app.get('/api/items/search', async (req, res) => {
  const { name } = req.query;

  try {
    const item = await prisma.item.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    if (item.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign up for a new account
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log in with an existing account
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logged-In User Routes (Authenticated Users)
// Write and submit a review for an item (text + rating)
app.post('/api/reviews', authenticateJWT, async (req, res) => {
  const { itemId, text, score } = req.body;
  const userId = req.user.id;

  if (!itemId || !text || score === undefined) {
    return res
      .status(400)
      .json({ error: 'Item ID, text, and score are required.' });
  }

  try {
    const review = await prisma.review.create({
      data: {
        text,
        score,
        userId,
        itemId,
      },
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit an existing review (text + rating)
app.put('/api/reviews/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { text, score } = req.body;
  const userId = req.user.id;

  try {
    const review = await prisma.review.update({
      where: {
        id: Number(id),
        userId,
      },
      data: { text, score },
    });

    // if (review.count === 0) {
    //   return res
    //     .status(404)
    //     .json({ error: 'Review not found or not owned by the user.' });
    // }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a review the user has written
app.delete('/api/reviews/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const review = await prisma.review.delete({
      where: {
        id: Number(id),
        userId,
      },
    });

    // if (review.count === 0) {
    //   return res
    //     .status(404)
    //     .json({ error: 'Review not found or not owned by user.' });
    // }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all reviews written by the user
app.get('/api/reviews/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { userId: Number(userId) },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Write a comment on another user's review
app.post('/api/comments', authenticateJWT, async (req, res) => {
  const { reviewId, text } = req.body;
  const userId = req.user.id;

  if (!reviewId || !text) {
    return res.status(400).json({ error: 'Review ID and text are required' });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        userId,
        reviewId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a comment the user has written
app.put('/api/comments/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.update({
      where: {
        id: Number(id),
        userId,
      },
      data: { text },
    });

    if (comment.count === 0) {
      return res
        .status(404)
        .json({ error: 'Comment not found or not owned by user' });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment the user has written
app.delete('/api/comments/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.deleteMany({
      where: {
        id: Number(id),
        userId,
      },
    });

    if (comment.count === 0) {
      return res
        .status(404)
        .json({ error: 'Comment not found or owned by user' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all comments the user has written
app.get('/api/comments/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { userId: Number(userId) },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
