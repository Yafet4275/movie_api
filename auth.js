// auth.js

const express = require('express');
const cors = require('cors');
const app = require('./index');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('./models').User
// const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
// router.use(cors());
// app.use(cors());
// require('./passport');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err); // Pass the error to the error handling middleware
    }
    
    if (!user) {
      // Authentication failed, return an appropriate response
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Authentication succeeded, generate a JWT token and send it as a response
    const token = jwt.sign({ id: user._id }, 'A7$9fG2z#P5!vR8qYpTmWbZnC');
    return res.json({ user, token });
  })(req, res, next);
});

router.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ //If a specific origin isn't found on the list of allowed origins
      let message = "The CORS policy for this application dosn't allow access from origin" + origin;
    return callback(new Error(message), false);
  }
  return callback(null, true);
  }
}));

module.exports = router;