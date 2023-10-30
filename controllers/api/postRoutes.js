const express = require('express');
const postController = require('../postController'); // Update the path

const router = express.Router();

// Create a post
router.post('/posts', postController.createPost);

// Get all posts
router.get('/posts', postController.getAllPosts);

// Get a specific post by ID
router.get('/posts/:postId', postController.getPostById);

// Update a post
router.put('/posts/:postId', postController.updatePost);

// Delete a post
router.delete('/posts/:postId', postController.deletePost);

module.exports = router;
