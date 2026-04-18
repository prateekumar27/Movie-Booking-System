import { createBooking, getAllBookings } from "./booking.service.js";

export const createBookingHandler = async (req, res, next) => {
  try {
    const booking = await createBooking(req.body, req.user._id);  // ✅
    res.status(201).json({
      success: true,
      message: "Booking successful!",
      booking,
    });
  } catch (error) {
    console.log("❌ booking error:", error.message);
    next(error);
  }
};

export const getUserBookingsHandler = async (req, res, next) => {
  try {
    const bookings = await getAllBookings(req.user._id);  // ✅
    res.status(200).json({
      success: true,
      message: "User bookings fetched successfully!",
      bookings,
    });
  } catch (error) {
    next(error);
  }
};