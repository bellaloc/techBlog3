const db = require('../models');

const commentController = {
  // Create a new comment
  createComment: async (req, res) => {
    try {
      const { text, postId } = req.body;
      const { userId } = req.session; // Assuming you store the user's ID in the session

      // Validate the text and postId fields
      if (!text || !postId || !userId) {
        return res.status(400).json({ error: 'text, postId, and userId fields are required' });
      }

      // Check if the post exists
      const post = await db.Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Create the comment
      const comment = await db.Comment.create({
        text,
        PostId: postId,
        UserId: userId,
      });

      res.status(201).json({ comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create a comment' });
    }
  },

  // Get all comments for a specific post
  getCommentsForPost: async (req, res) => {
    try {
      const postId = req.params.postId;

      // Validate the postId field
      if (!postId) {
        return res.status(400).json({ error: 'postId field is required' });
      }

      // Get all comments for the post
      const comments = await db.Comment.findAll({
        where: { PostId: postId },
        include: db.User, // Include the User model to get the user's information
      });

      res.json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get comments' });
    }
  },

  // Update a comment
  updateComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const { text } = req.body;

      // Validate the commentId and text fields
      if (!commentId || !text) {
        return res.status(400).json({ error: 'commentId and text fields are required' });
      }

      // Find the comment
      const comment = await db.Comment.findByPk(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Update the comment text
      comment.text = text;
      await comment.save();

      res.json({ comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the comment' });
    }
  },

  // Delete a comment
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;

      // Validate the commentId field
      if (!commentId) {
        return res.status(400).json({ error: 'commentId field is required' });
      }

      // Find the comment
      const comment = await db.Comment.findByPk(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Delete the comment
      await comment.destroy();

      // Respond with a success message
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the comment' });
    }
  },
};

module.exports = commentController;
