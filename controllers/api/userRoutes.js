const express = require('express');
const userController = require('../userController'); // Update the path

const router = express.Router();

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// User logout
router.post('/logout', userController.logoutUser);

module.exports = router;
