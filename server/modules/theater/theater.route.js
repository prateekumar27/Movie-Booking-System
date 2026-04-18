import express from "express";
import {
  createTheater,
  getAllTheaters,
  getTheaterById,
  getTheaterByState,
} from "./theater.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/addtheater", asyncHandler(createTheater));
router.get("/", asyncHandler(getAllTheaters));
router.get("/getbyid/:id", asyncHandler(getTheaterById));
router.get("/getbystate/:state", asyncHandler(getTheaterByState));

export default router;
