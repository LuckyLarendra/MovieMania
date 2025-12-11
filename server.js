const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
// const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Load movie data
const moviesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/movies.json'), 'utf8'));

// Helper function for pagination
function paginate(array, page, perPage) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return array.slice(start, end);
}

// Routes
app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const totalMovies = moviesData.length;
  const totalPages = Math.ceil(totalMovies / perPage);
  
  const movies = paginate(moviesData, page, perPage);
  
  res.render('home', {
    movies,
    currentPage: page,
    totalPages,
    totalMovies
  });
});

app.get('/genres', (req, res) => {
  // Group movies by genre
  const genres = {};
  
  moviesData.forEach(movie => {
    movie.genres.forEach(genre => {
      if (!genres[genre]) {
        genres[genre] = [];
      }
      genres[genre].push(movie);
    });
  });
  
  res.render('genres', {
    genres,
    movies: moviesData
  });
});

app.get('/all-movies', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const totalMovies = moviesData.length;
  const totalPages = Math.ceil(totalMovies / perPage);
  
  const movies = paginate(moviesData, page, perPage);
  
  res.render('all-movies', {
    movies,
    currentPage: page,
    totalPages,
    totalMovies
  });
});

app.listen(PORT, () => {
  console.log(`Server running on https://luckylarendra.github.io/MovieMania/`);
});