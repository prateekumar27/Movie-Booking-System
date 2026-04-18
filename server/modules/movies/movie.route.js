import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { getAllMovies, getMovieById, createMovie, getTopRecommendedMovies } from "./movie.controller.js";

const router = express.Router();

router.post("/addmovie", asyncHandler(createMovie));
router.get("/", asyncHandler(getAllMovies));
router.get("/getmovie/:id", asyncHandler(getMovieById));
router.get("/recommended", asyncHandler(getTopRecommendedMovies));

export default router;
