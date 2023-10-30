const db = require('../models');

const postController = {
  // Create a new post
  createPost: async (req, res) => {
    try {
      const { title, content } = req.body;
      const { userId } = req.session; // Assuming you store the user's ID in the session

      const post = await db.Post.create({
        title,
        content,
        UserId: userId,
      });

      res.status(201).json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create the post' });
    }
  },

  // Get all posts
  getAllPosts: async (req, res) => {
    try {
      const posts = await db.Post.findAll({
        include: db.User,
      });

      res.json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  },

  // Get a specific post by ID
  getPostById: async (req, res) => {
    try {
      const postId = req.params.postId;

      const post = await db.Post.findByPk(postId, {
        include: db.User,
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get the post' });
    }
  },

  // Update a post
  updatePost: async (req, res) => {
    try {
      const postId = req.params.postId;
      const { title, content } = req.body;

      const post = await db.Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      post.title = title; // Update the post title
      post.content = content; // Update the post content
      await post.save();

      res.json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the post' });
    }
  },

  // Delete a post
  deletePost: async (req, res) => {
    try {
      const postId = req.params.postId;

      const post = await db.Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      await post.destroy(); // Delete the post

      res.status(204).end(); // Respond with 204 No Content status
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the post' });
    }
  },
};

module.exports = postController;
