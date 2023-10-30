const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('passport');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    // Get all posts from the database, including the author information
    const posts = await db.Post.findAll({
      include: {
        model: db.User,
        as: 'author',
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await db.Post.findByPk(postId, {
      include: {
        model: db.User,
        as: 'author',
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new post (Authenticated using Passport)
router.post('/posts', passport.authenticate('jwt'), async (req, res) => {
  try {
    const postData = req.body;

    // Create a new post associated with the authenticated user
    const post = await db.Post.create({
      ...postData,
      authorId: req.user.id,
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post by ID (Authenticated using Passport)
router.put('/posts/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postData = req.body;

    const post = await db.Post.findByPk(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await post.update(postData);

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post by ID (Authenticated using Passport)
router.delete('/posts/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await db.Post.findByPk(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await post.destroy();

    res.status(204).end(); // 204 No Content status for successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
