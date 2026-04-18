import { Router } from "express";
import { createOrder, verifyPayment } from "../payment/payment.controller.js";
import authCheck from "../../middlewares/authCheck.js";

const router = Router();

router.post("/create-order", authCheck, createOrder);
router.post("/verify-order", authCheck, verifyPayment);

export default router;
