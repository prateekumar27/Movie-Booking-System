// routes/user.route.js
import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  activateUser,
} from "../users/user.controller.js";

import asyncHandler from "../../utils/asyncHandler.js";
import authCheck from "../../middlewares/authCheck.js";

const router = express.Router();

router.post("/adduser", asyncHandler(createUser));
router.get("/getallusers", asyncHandler(getAllUsers));
router.get("/getuser/me", authCheck, asyncHandler(getUserById));
router.put("/activateuser/:id", authCheck, asyncHandler(activateUser));

export default router;
