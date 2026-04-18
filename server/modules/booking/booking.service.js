import mongoose from "mongoose";
import Razorpay from "razorpay";
import { Booking } from "./booking.model.js";
import Show from "../show/show.model.js";
import { generateBookingReference } from "../../utils/index.js";

// ─── CREATE BOOKING ───────────────────────────────────────────
export const createBooking = async (bookingData, userId) => {
  // 1. Basic Validation
  if (
    !bookingData.showId ||
    !bookingData.seats ||
    bookingData.seats.length === 0 ||
    !bookingData.paymentId ||
    !bookingData.bookingFee
  ) {
    throw new Error("Invalid booking data");
  }

  // 2. Destructure
  const { showId, seats, paymentId, bookingFee } = bookingData;

  if (!showId || !seats || seats.length === 0 || !paymentId || !bookingFee) {
    throw new Error("Invalid booking data");
  }

  // 3. Generate unique booking reference
  const bookingRef = generateBookingReference();

  // 4. Start Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 5. Check if any requested seat is already booked
    const existingBooking = await Booking.findOne({
      show: showId,
      status: "CONFIRMED",
      seats: { $in: seats },
    }).session(session);

    if (existingBooking) {
      throw new Error("One or more of the requested seats are already booked!");
    }

    // 6. Verify Razorpay Payment
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentDetails = await razorpay.payments.fetch(paymentId);

    if (paymentDetails.status !== "captured") {
      throw new Error("Payment not successful");
    }

    // 7. Create Booking
    const [booking] = await Booking.create(
      [
        {
          bookingReference: bookingRef,
          userId,
          show: showId,
          seats,
          status: "CONFIRMED",
          paymentId,
          paymentMethod: paymentDetails.method,
          bookingFee,
        },
      ],
      { session },
    );

    // 8. Update Seat Availability in Show Document
    const show = await Show.findById(showId).session(session);
    if (!show) throw new Error("Show not found!");

    const parsedSeats = seats.map((seat) => {
      const row = seat.charAt(0);
      const number = parseInt(seat.slice(1));
      return { row, number };
    });

    for (const parsedSeat of parsedSeats) {
      const row = show.seatLayout.find((r) => r.row === parsedSeat.row);
      if (!row) throw new Error(`Invalid seat row: ${parsedSeat.row}`);

      const seat = row.seats.find((s) => s.number === parsedSeat.number);
      if (!seat)
        throw new Error(
          `Invalid seat number: ${parsedSeat.number} in row ${parsedSeat.row}`,
        );

      if (seat.status === "BOOKED") {
        throw new Error(
          `Seat ${parsedSeat.row}${parsedSeat.number} is already booked!`,
        );
      }

      seat.status = "BOOKED";
    }

    show.markModified("seatLayout"); // 🔥 ADD THIS LINE
    await show.save({ session });

    // 9. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("FULL ERROR STACK:", error.stack); // ← add this
    throw error;
  }
};

// ─── GET ALL BOOKINGS BY USER ─────────────────────────────────
export const getAllBookings = async (userId) => {
  return await Booking.find({ userId })
    .populate({
      path: "show",
      select: "startTime date audioType format",
      populate: [
        {
          path: "movie",
          select: "title posterUrl duration",
        },
        {
          path: "theater",
          select: "name location city state",
        },
      ],
    })
    .sort({ createdAt: -1 }); // latest booking first
};
