import {
  createOrderService,
  verifyPaymentService,
} from "../payment/payment.service.js";

/**
 * POST /api/payment/create-order
 */

export const createOrder = async (req, res) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body); // Should NOT be undefined
  try {
    const { amount, showId, seatIds } = req.body;
    const userId = req.user._id; // from auth middleware

    if (!amount || !showId || !seatIds?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await createOrderService({ amount, userId, showId, seatIds });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/payment/verify
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      showId,
      seatIds,
    } = req.body;

    const userId = req.user._id;

    const result = await verifyPaymentService({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      showId,
      seatIds,
      userId,
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    const isSignatureError = error.message === "Invalid payment signature";
    res.status(isSignatureError ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};
