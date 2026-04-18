import Theater from "./theater.model.js";
import customError from "../../utils/errorHandler.js";


// 1. Create Theater
export const createTheater = async (req, res) => {
  const { name, location, logo, city, state } = req.body;

  if (!name.trim() || !location.trim() || !logo.trim() || !city.trim() || !state.trim()) {
    throw new customError("All fields are required", 400);
  }

  const theater = await Theater.create({ name, location, logo, city, state });
  res.status(201).json({ success: true, data: theater });
};

// 2. Get All Theaters
export const getAllTheaters = async (req, res) => {
  const theaters = await Theater.find();
  res.status(200).json({ success: true, data: theaters });
};

// 3. Get Theater By ID
export const getTheaterById = async (req, res) => {
  const theater = await Theater.findById(req.params.id);
  if (!theater) throw new customError("Theater not found", 404);
  res.status(200).json({ success: true, data: theater });
};

// 4. Get Theater By State
export const getTheaterByState = async (req, res) => {
  const theaters = await Theater.find({
    state: { $regex: req.params.state, $options: "i" }, // case insensitive
  });
  if (!theaters.length) throw new customError("No theaters found in this state", 404);
  res.status(200).json({ success: true, data: theaters });
};