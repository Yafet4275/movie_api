// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./models').User

passport.use(new LocalStrategy(
  {
    usernameField: 'Name', // Assuming 'Name' is your username field
    passwordField: 'Password', // Assuming 'Password' is your password field
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ Name: username });

      if (!user || !user.verifyPassword(password)) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'A7$9fG2z#P5!vR8qYpTmWbZnC',
}, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));
