const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(morgan('dev'));
app.use(express.static('public'));

// Routes
app.get('/movies', (req, res) => {
  const movies = [
    { title: 'Ex Machina', year: 2014, rating: 7.7 },
    { title: 'Blade Runner', year: 1982, rating: 8.1 },
    { title: 'A Space Odyssey', year: 1968, rating: 8.3 },
    { title: 'The Terminator', year: 1984, rating: 8.0 },
    { title: 'Her', year: 2013, rating: 8.0 },
    { title: 'A.I. Artificial Intelligence', year: 2001, rating: 7.2 },
    { title: 'The Matrix', year: 1999, rating: 8.7 },
    { title: 'WarGames', year: 1983, rating: 7.1 },
    { title: 'Transcendence ', year: 2014, rating: 6.3 },
    { title: 'Ghost in the Shell', year: 1995, rating: 8.0 },
  ];

  res.json(movies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my website!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

// Serve documentation.html from the public folder
app.get('/documentation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
