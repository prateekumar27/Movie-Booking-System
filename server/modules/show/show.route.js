import express from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createShow,
  getShowById,
  updateSeatStatus,
  getShowsByMovieDateLocation,
} from "./show.controller.js";

const router = express.Router();

// router.post("/add", asyncHandler(createShow));
// router.get("/getbyid/:id", asyncHandler(getShowById));
// router.put("/updateseat/:id", asyncHandler(updateSeatStatus));
// router.get("/search", asyncHandler(getShowsByMovieDateLocation));

// show.route.js — REMOVE asyncHandler wrappers
router.post("/add", createShow);
router.get("/getbyid/:id", getShowById);
router.put("/updateseat/:id", updateSeatStatus);
router.get("/search", getShowsByMovieDateLocation);

export default router;
