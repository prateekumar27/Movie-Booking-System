import Movie from "./movie.model.js";
import customError from "../../utils/errorHandler.js";

const getAllMovies = async (req, res) => {
  const movies = await Movie.find();
  res.status(200).json(movies);
};
const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new customError("Movie not found", 404);
  res.status(200).json(movie);
};

const createMovie = async (req, res) => {
  const {
    title,
    posterUrl,
    description,
    rating,
    genre,
    releaseDate,
    duration,
    languages,
    certification,
    votes,
  } = req.body;

  // check strings
  if (!title || !posterUrl || !description || !duration || !certification || !releaseDate) {
    throw new customError("All fields are required", 400);
  }

  // check numbers — rating/votes can be 0 which is falsy
  if (!String(rating).trim() || isNaN(rating) || !String(votes).trim() || isNaN(votes)) {
  throw new customError("Rating and votes must be valid numbers", 400);
}

  // check arrays — empty array is truthy so check length too
  if (!genre || genre.length === 0) {
    throw new customError("At least one genre is required", 400);
  }

  if (!languages || languages.length === 0) {
    throw new customError("At least one language is required", 400);
  }

  const movie = await Movie.create(req.body);
  if (!movie) throw new customError("Failed to create movie", 400);
  res.status(201).json({ success: true, data: movie });
};

const getTopRecommendedMovies = async (req, res) => {
  const movies = await Movie.find().sort({ rating: -1 }).limit(5);
  res.status(200).json(movies);
};

export { getAllMovies, getMovieById, createMovie, getTopRecommendedMovies };
