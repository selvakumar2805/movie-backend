const express = require("express")


let {
  addMovie,
  getAllMovies,
  getMovieById,
} = require ("../controllers/movie-controller")

const movieRouter = express.Router();
movieRouter.get("/", getAllMovies); // call - 1
movieRouter.get("/:id", getMovieById); // call - 4
movieRouter.post("/", addMovie); // call - 10

module.exports = movieRouter;