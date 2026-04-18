import express from "express";
import {
  sendOtp,
  verifyOtp,
  logout,
  refreshToken,
} from "../auth/auth.controller.js";
import authCheck from "../../middlewares/authCheck.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/send-otp", asyncHandler(sendOtp));
router.post("/verify-otp", asyncHandler(verifyOtp));
router.post("/logout", authCheck, asyncHandler(logout));
router.post("/refresh-token", asyncHandler(refreshToken));

export default router;
