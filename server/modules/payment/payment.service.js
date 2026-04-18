import Razorpay from "razorpay";
import crypto from "crypto";
import env from "dotenv";
import Show from "../show/show.model.js";

env.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * CREATE ORDER
 * Called before payment — creates a Razorpay order
 */
export const createOrderService = async ({
  amount,
  userId,
  showId,
  seatIds,
}) => {
  const options = {
    amount: amount * 100, // convert ₹ to paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: { userId, showId, seatIds: seatIds.join(",") },
  };

  const order = await razorpay.orders.create(options);
  return order;
};

/**
 * VERIFY PAYMENT + CONFIRM BOOKING
 * Called after Razorpay payment modal closes successfully
 */
export const verifyPaymentService = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  showId,
  seatIds,
  userId,
}) => {
  // STEP 1: Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  // STEP 2: Mark seats as BOOKED in the Show
  const show = await Show.findById(showId);
  if (!show) throw new Error("Show not found");

  // Update seat status to BOOKED
  show.seatLayout = show.seatLayout.map((row) => ({
    ...row,
    seats: row.seats.map((seat) =>
      seatIds.includes(seat.number)
        ? { ...seat, status: "BOOKED", bookedBy: userId }
        : seat,
    ),
  }));

  await show.save();

  // STEP 3: Return confirmation (no Booking model needed)
  return {
    success: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    showId,
    seatIds,
    userId,
  };
};
