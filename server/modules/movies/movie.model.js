import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    format: {
      type: [String],
      default: ["2D"],
    },
    genre: {
      type: [String],
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    languages: {
      type: [String],
      required: true,
    },
    certification: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
