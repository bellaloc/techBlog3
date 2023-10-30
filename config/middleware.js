const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Session configuration
  app.use(
    session({
      secret: 'your-secret-key', // Replace with your secret key
      resave: true,
      saveUninitialized: true,
    })
  );

  // Passport configuration for user authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // Modify to match your field name for email/username
      },
      function (email, password, done) {
        // Implement your user authentication logic here
        // Check if the email and password are valid
        // Example:
        // User.findOne({ where: { email: email } })
        //   .then((user) => {
        //     if (!user || !user.validPassword(password)) {
        //       return done(null, false, { message: 'Incorrect email or password' });
        //     }
        //     return done(null, user);
        //   })
        //   .catch((err) => done(err));
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser(function (user, done) {
    done(null, user.id); // Modify to match your user data
  });

  passport.deserializeUser(function (id, done) {
    // Implement user deserialization logic
    // Example:
    // User.findByPk(id)
    //   .then((user) => done(null, user))
    //   .catch((err) => done(err));
  });

  // Middleware to check if the user is authenticated
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login'); // Redirect to the login page if not authenticated
  });
};
