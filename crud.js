const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

let movies;
readFile();
function readFile() {
  movies = JSON.parse(fs.readFileSync("movies.json", "utf-8"));
}

function writeFile(movies) {
  fs.writeFileSync("./movies.json", JSON.stringify(movies), "utf-8");
}

//Recibe todas las películas
app.get("/movies", (req, res) => {
  readFile();
  res.json(movies);
});

//Recibe una película dado un nombre
app.get("/movies/:id", (req, res) => {
  readFile();
  const movieFind = movies.find((movie) => movie.nombre === req.params.id);
  res.json(movieFind);
});

//Crea una película
app.post("/movies", (req, res) => {
  const newMovie = req.body;
  movies.push(newMovie);
  writeFile(movies);
  res.json(movies);
});

//Borra una película
app.delete("/movies/:id", (req, res) => {
  readFile();
  const movieName = req.params.id;
  movies = movies.filter(function (el) {
    return el.nombre != movieName;
  });
  writeFile(movies);
  res.json(movies);
});

//Actualiza una película
app.put("/movies/:id", (req, res) => {
  readFile();
  const movieName = req.params.id;
  const updatedMovie = req.body;
  movies.filter(function (el) {
    if (el.nombre == movieName) {
      el.año = updatedMovie.año;
    }
  });
  writeFile(movies);
  res.json(movies);
});

//Suma un like a la película
app.put("/movies/like/:id", (req, res) => {
  readFile();
  const movieName = req.params.id;
  movies.filter(function (el) {
    if (el.nombre == movieName) {
      el.likes++;
    }
  });
  writeFile(movies);
  res.json(movies);
});

//Películas que tienen una cantidad de likes
app.get("/movies/likes/:amount", (req, res) => {
  readFile();
  const amount = req.params.amount;
  const bestMovies = [];
  movies.forEach((movie) => {
    if (movie.likes > Number(amount)) {
      bestMovies.push(movie);
    }
  });
  res.json(bestMovies);
});

app.listen(3000, () => console.log("Listening on port 3000"));
