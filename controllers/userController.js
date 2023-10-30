const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust the number of salt rounds

const userController = {
  // User registration
  registerUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate the username and password fields
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password fields are required' });
      }

      // Check if the username is already taken
      const existingUser = await db.User.findOne({ where: { username } });

      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await db.User.create({ username, password: hashedPassword });

      res.status(201).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  },

  // User login
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate the username and password fields
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password fields are required' });
      }

      const user = await db.User.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Store user information in the session
      req.session.userId = user.id;

      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to login' });
    }
  },

  // User logout
  logoutUser: (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'You must be logged in to logout' });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to logout' });
        }
        res.status(204).end(); // Respond with 204 No Content status for successful logout
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to logout' });
    }
  },
};

module.exports = userController;
