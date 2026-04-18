import express from "express";
import {
  createBookingHandler,
  getUserBookingsHandler,
} from "./booking.controller.js";
import authCheck from "../../middlewares/authCheck.js";

const router = express.Router();

router.post("/", authCheck, createBookingHandler);
router.get("/", authCheck, getUserBookingsHandler);

export default router;
