const express = require("express");
const session = require("express-session");
const passport = require("./config/passport"); // You'll create this
const db = require("./models");
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "your-secret", // Change this to a more secure secret
    resave: true,
    saveUninitialized: true
  }));
;
app.use(passport.initialize());
app.use(passport.session());

// Routes
require("./controllers/home-routes.js")(app);
require("./controllers/api/index.js")(app);

// Database synchronization
db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
