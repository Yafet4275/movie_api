const bodyParser = require('body-parser'),
  express = require('express'), 
  path = require('path'), 
  app = express(),
  uuid = require('uuid'), 
  PORT = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({extended: true}));
// let auth = require('./auth')(app);
const auth = require('./auth')(app);
const passport =  require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movie = Models.Movie;
const User = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/movie', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
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

app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ Name: req.body.Name });
    if (existingUser) {
      return res.status(400).send(req.body.Name + " already exists");
    }

    const newUser = new User({
      Name: req.body.Name,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
      Password: req.body.Password,
      Country: req.body.Country,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error.message);
  }
});
  

  // app.post("/users", async (req, res) => {
  //   const { Username, Password } = req.body;
  
  //   console.log("Received data:", req.body);
  
  //   try {
  //     const existingUser = await User.findOne({ Username });
  //     if (existingUser) {
  //       return res.status(400).send(`${Username} already exists.`);
  //     }
  
  //     const newUser = new User({
  //       Username,
  //       Password,
  //     });
  
  //     await newUser.save();
  //     console.log("User saved:", newUser);
  //     res.status(201).json(newUser);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Error: " + error.message);
  //   }
  // });
  
  
  
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

//Allow user to deregister
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
