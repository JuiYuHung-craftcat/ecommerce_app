const passport = require("passport");
const LocalStrategy = require("passport-local");
const AuthService = require("../services/authService");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((id, done) => {
    done(null, { id });
  });

  // Configurate local strategy to be used for local login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await AuthService.login({
          email: username,
          password: password,
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  return passport;
};
