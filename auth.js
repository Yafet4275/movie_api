// auth.js

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('./models').User
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


module.exports = router;
