import Show from "./show.model.js";
import customError from "../../utils/errorHandler.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  generateSeatLayout,
  groupShowsByTheatreAndMovie,
} from "../../utils/showUtils.js";
import mongoose from "mongoose";

// 1. Create Show
export const createShow = asyncHandler(async (req, res) => {
  const {
    movie,
    theater,
    location,
    format,
    audioType,
    startTime,
    date,
    priceMap,
  } = req.body;

  if (
    !movie ||
    !theater ||
    !location.trim() ||
    !format ||
    !startTime.trim() ||
    !date.trim()
  ) {
    throw new customError("All fields are required", 400);
  }

  const seatLayout = generateSeatLayout(); // auto generate seats

  const show = await Show.create({
    movie,
    theater,
    location,
    format,
    audioType,
    startTime,
    date,
    priceMap,
    seatLayout,
  });

  res.status(201).json({ success: true, data: show });
});

// 2. Get Shows By Movie, Location and Date
export const getShowsByMovieDateLocation = asyncHandler(async (req, res) => {
  const { movieId, location, date } = req.query;

  console.log("Query params:", { movieId, location, date });

  if (!movieId || !location) {
    throw new customError("movieId and location are required", 400);
  }

  // First find WITHOUT date and location to check if movie exists
  const allShows = await Show.find({
    movie: new mongoose.Types.ObjectId(movieId),
  });

  console.log("Total shows for this movie:", allShows.length);
  console.log("Sample show:", {
    location: allShows[0]?.location,
    date: allShows[0]?.date,
    movie: allShows[0]?.movie,
  });

  const query = {
    movie: new mongoose.Types.ObjectId(movieId),
    location: { $regex: new RegExp(location, "i") },
  };

  if (date) query.date = date;

  const shows = await Show.find(query)
    .populate("movie theater")
    .sort({ startTime: 1 });

  console.log("Filtered shows:", shows.length);

  const groupedShows = groupShowsByTheatreAndMovie(shows);
  res.status(200).json({ success: true, data: groupedShows });
});

// 3. Get Show By ID
export const getShowById = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id).populate("movie theater");

  if (!show) throw new customError("Show not found", 404);

  // 🔥 ADD THIS
  console.log("SHOW DATA BACKEND:", JSON.stringify(show.seatLayout, null, 2));

  res.status(200).json({ success: true, data: show });
});

// 4. Update Seat Status
export const updateSeatStatus = asyncHandler(async (req, res) => {
  const { row, seatNumber, status } = req.body;

  if (!row || !seatNumber || !status) {
    throw new customError("Row, seatNumber and status are required", 400);
  }

  const updated = await Show.updateOne(
    { _id: new mongoose.Types.ObjectId(req.params.id), "seatLayout.row": row },
    {
      $set: {
        "seatLayout.$.seats.$[elem].status": status,
      },
    },
    {
      arrayFilters: [{ "elem.number": seatNumber }],
    },
  );

  if (!updated.modifiedCount)
    throw new customError("Seat not found or already updated", 400);

  res.status(200).json({ success: true, message: "Seat status updated" });
});
