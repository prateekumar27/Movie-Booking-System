import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      // ✅ was: bookingref
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["Failed", "CONFIRMED", "CANCELLED"],
      required: true,
      default: "CONFIRMED",
    },
    bookingDateTime: {
      // ✅ was: bookingdateTime
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    bookingFee: {
      ticketPrice: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      convenience: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.pre("save", async function () {
  this.seats.sort();
});

export const Booking = mongoose.model("Booking", bookingSchema);
