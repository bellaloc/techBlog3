const express = require('express');
const router = express.Router();
const apiRoutes = require('./api'); // Update the path
const homeRoutes = require('./homeRoutes'); // Update the path
const dashboardRoutes = require('./dashboardRoutes'); // Update the path

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
