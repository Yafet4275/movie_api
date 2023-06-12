const bodyParser = require('body-parser'),
 express = require('express'), 
 path = require('path'), 
 app = express(),
 uuid = require('uuid'), 
 PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["The Fountain"]
  }
]

let movies = [
  { 
    Title: 'Ex Machina',
    Year: 2014,
    Rating: 7.7,
    Description: 'A young programmer is selected to participate in a groundbreaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid AI.',
    Comments: ['Great movie!', 'Mind-bending storyline.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'Alex Garland', Bio: 'Alex Garland is a British writer and filmmaker.', Birth: 1970 },
    ImageURL: 'https://example.com/exmachina.jpg',
    Featured: true
  },
  { 
    Title: 'Blade Runner',
    Year: 1982,
    Rating: 8.1,
    Description: 'A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.',
    Comments: ['A classic!', 'Visually stunning.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'Ridley Scott', Bio: 'Ridley Scott is an English film director and producer.', Birth: 1937 },
    ImageURL: 'https://example.com/bladerunner.jpg',
    Featured: false
  },
  { 
    Title: 'A Space Odyssey',
    Year: 1968,
    Rating: 8.3,
    Description: 'Humanity finds a mysterious, obviously artificial object buried beneath the Lunar surface and, with the intelligent computer H.A.L. 9000, sets off on a quest.',
    Comments: ['Mind-blowing!', 'A masterpiece of cinema.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'Stanley Kubrick', Bio: 'Stanley Kubrick was an American film director, screenwriter, and producer.', Birth: 1928, Death: 1999 },
    ImageURL: 'https://example.com/aspaceodyssey.jpg',
    Featured: true
  },
  { 
    Title: 'The Terminator',
    Year: 1984,
    Rating: 8.0,
    Description: 'A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine, sent from the same year, which has been programmed to execute a young woman.',
    Comments: ['Action-packed!', 'Iconic film with great one-liners.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'James Cameron', Bio: 'James Cameron is a Canadian film director, producer, and screenwriter.', Birth: 1954 },
    ImageURL: 'https://example.com/terminator.jpg',
    Featured: false
  },
  { 
    Title: 'Her',
    Year: 2013,
    Rating: 8.0,
    Description: 'In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.',
    Comments: ['Thought-provoking!', 'Beautifully crafted.'],
    Genre: { Name: 'Romance', Description: 'A genre focused on the romantic relationships between characters.' },
    Director: { Name: 'Spike Jonze', Bio: 'Spike Jonze is an American filmmaker, photographer, and actor.', Birth: 1969 },
    ImageURL: 'https://example.com/her.jpg',
    Featured: true
  },
  { 
    Title: 'A.I. Artificial Intelligence',
    Year: 2001,
    Rating: 7.2,
    Description: 'A highly advanced robotic boy longs to become "real" so that he can regain the love of his human mother.',
    Comments: ['Emotional journey!', 'Hauntingly beautiful.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'Steven Spielberg', Bio: 'Steven Spielberg is an American film director, producer, and screenwriter.', Birth: 1946 },
    ImageURL: 'https://example.com/ai.jpg',
    Featured: false
  },
  { 
    Title: 'The Matrix',
    Year: 1999,
    Rating: 8.7,
    Description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    Comments: ['Mind-blowing action!', 'Revolutionary visual effects.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'The Wachowskis', Bio: 'Lana Wachowski and Lilly Wachowski are American film and television directors, writers, and producers.', Birth: 1965 },
    ImageURL: 'https://example.com/matrix.jpg',
    Featured: true
  },
  { 
    Title: 'WarGames',
    Year: 1983,
    Rating: 7.1,
    Description: 'A young man finds a back door into a military central computer in which reality is confused with game-playing, possibly starting World War III.',
    Comments: ['Classic 80s film!', 'Nostalgic and thrilling.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'John Badham', Bio: 'John Badham is an English-born American film director and television director.', Birth: 1939 },
    ImageURL: 'https://example.com/wargames.jpg',
    Featured: false
  },
  { 
    Title: 'Transcendence',
    Year: 2014,
    Rating: 6.3,
    Description: "A scientist's drive for artificial intelligence takes on dangerous implications when his consciousness is uploaded into one such program.",
    Comments: ['Interesting concept!', 'Thought-provoking but flawed.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'Wally Pfister', Bio: 'Wally Pfister is an American cinematographer and film director.', Birth: 1961 },
    ImageURL: 'https://example.com/transcendence.jpg',
    Featured: true
  },
  { 
    Title: 'Ghost in the Shell',
    Year: 1995,
    Rating: 8.0,
    Description: 'A cyborg policewoman and her partner hunt a mysterious and powerful hacker called the Puppet Master.',
    Comments: ['Groundbreaking anime!', 'Philosophically rich.'],
    Genre: { Name: 'Science Fiction', Description: 'Fiction based on imagined future scientific or technological advances.' },
    Director: { Name: 'Mamoru Oshii', Bio: 'Mamoru Oshii is a Japanese filmmaker, television director, and screenwriter.', Birth: 1951 },
    ImageURL: 'https://example.com/ghostintheshell.jpg',
    Featured: false
  }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

app.get('/users', (req, res) => {
  res.status(200).json(users);
})

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  let user = users.find(user => user.id == id);
  if (user) {
    res.status(200).json(user);
  }
});

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    return res.status(200).json(movie);
  }else{
    res.status(400).send('no such movie');
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    return res.status(200).json(genre);
  }else{
    res.status(400).send('no such movie');
  }
});

app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;

  if (director) {
    return res.status(200).json(director);
  }else{
    res.status(400).send('no such movie');
  }
});

// Serve documentation.html from the public folder
app.get('/documentation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Post
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  }else{
    res.status(400).send('users need names');
  }
})

// Create
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find(user => user.id == id);
  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(user);
  }else{
    res.status(400).send('no such user');
  }
})

// Update
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;
  let user = users.find(user => user.id == id);
  if (user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  }else{
    res.status(400).send('no such user');
  }
})

// Delete
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  let user = users.find(user => user.id == id);
  if (user) {
    users = users.filter( user => user.id != id );
    res.status(200).send(`user ${id} has been deleted`);
  }else{
    res.status(400).send('no such user');
  }
})

app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find(user => user.id == id);
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`Movie title has been deleted`);
  }else{
    res.status(400).send('no such user');
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
