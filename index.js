// index.js
//I installed cors through npm install cors 

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const path = require('path');
const jwt = require('jsonwebtoken');
// const app = require('./index');
const app = express();

const PORT = process.env.PORT || 8080;
const { check, validationResult } = require('express-validator');

app.use(bodyParser.urlencoded({extended: true}));
const authRouter = require('./auth');
const passport =  require('passport');
// require('./passport');
const mongoose = require('mongoose');
const { User, Movie } = require('./models');

mongoose.connect('process.env.CONNECTION_URI', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use(cors({
  origin: (origin, callback) => {
    let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use('/', authRouter);

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Movie.find()
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get('/users', passport.authenticate('jwt', { session: false }), async function (req, res) {
  User.find()
    .then(function(user) {
      res.status(200).json(user);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get('/Users/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  User.findOne({Name: req.params.name})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Movie.findOne({Title: req.params.Title})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get('/genre/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Movie.findOne({'Genre.Name': req.params.name})
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

app.get('/director/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  Movie.findOne({'Director.Name': req.params.name})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

app.post('/users',
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {

// check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = userSchema.hashPassword(req.body.Password);
  await User.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        User.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
  
// Authenticate user using local strategy (username and password)
app.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: info.message });
    }
    // If authentication succeeds, generate JWT token
    const token = jwt.sign({ id: user._id }, 'A7$9fG2z#P5!vR8qYpTmWbZnC');
    // Return the user and the token as a JSON response
    return res.json({ user, token });
  })(req, res);
});
  
app.post('/users/:Username/favorites/:MovieTitle', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { Username, MovieTitle } = req.params;
  // Find the user by their username
  User.findOne({ Name: Username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      // Find the movie by its title
      Movie.findOne({ Title: MovieTitle })
        .then((movie) => {
          if (!movie) {
            return res.status(404).send('Movie not found');
          }
          // Check if the movie is already in the user's favorites
          if (user.FavoriteMovies.includes(movie._id)) {
            return res.status(400).send('Movie already in favorites');
          } else {
            // Add the movie's ID to the user's favorites
            user.FavoriteMovies.push(movie._id);
            // Save the updated user data and send it in the response
            user.save().then((updatedUser) => {
              res.status(200).json(updatedUser);
            }).catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Allow users to update their user info
app.put("/users/:name", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Name !== req.params.name) {
    return res.status(400).send('Permission denied');
  }
  // condition ends
  
  await User.findOneAndUpdate(
    {Name: req.params.name},
    {
      $set: {
        Name: req.body.Name,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
        Password: req.body.Password,
        Country: req.body.Country,
      },
    },
    {new: true}) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  });

app.delete('/users/:Username/favorites/:MovieTitle', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { Username, MovieTitle } = req.params;
  // Find the user by their username
  User.findOne({ Name: Username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      // Find the movie by its title
      Movie.findOne({ Title: MovieTitle })
        .then((movie) => {
          if (!movie) {
            return res.status(404).send('Movie not found');
          }
          // Check if the movie is in the user's favorites
          const movieIndex = user.FavoriteMovies.indexOf(movie._id);
          if (movieIndex === -1) {
            return res.status(400).send('Movie is not in favorites');
          }
          // Remove the movie's ID from the user's favorites
          user.FavoriteMovies.splice(movieIndex, 1);
          // Save the updated user data
          user.save()
            .then((updatedUser) => {
              res.status(200).json(updatedUser);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allow existing user to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  User.findOneAndRemove({ Name: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add this line to serve a specific file
app.get('/documentation', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Start the server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port' + port);
});

module.exports = app;