import { isValidEmail } from "../../utils/index.js";
import { generateOTP, hashOTP, verifyOTP } from "../auth/generateOtp.js";
import {
  generateToken,
  storeRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken, // ✅ add this
  findRefreshToken, // ✅ add this
  updateRefreshToken, // ✅ add this
} from "../auth/generateToken.js";
import sendEmail from "../../services/mailer.js";
import { otpverificationtemplate } from "../../Templates/mailTemplates.js";
import User from "../users/user.model.js";

// ── SEND OTP ──────────────────────────────────────────
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 2. generate otp
    const otp = generateOTP();

    // 3. hash otp with email + expiry
    const ttl = 1000 * 60 * 2; // 2 minutes
    const expires = Date.now() + ttl;
    const data = `${email}.${otp}.${expires}`;
    const hashedOTP = hashOTP(data);
    console.log("=== SEND OTP ===");
    console.log("otp:", otp, typeof otp);
    console.log("expires:", expires, typeof expires);
    console.log("data:", data);
    console.log("hashedOTP:", hashedOTP);
    console.log("hash sent:", `${hashedOTP}:${expires}`);

    // 4. send otp to user email
    try {
      const content = otpverificationtemplate.replace("{otp}", otp);
      await sendEmail(email, "Your OTP Verification Code", content);
    } catch (error) {
      return res.status(500).json({ message: "Failed to send email" });
    }

    // 5. respond to client
    res.status(200).json({
      hash: `${hashedOTP}:${expires}`,
      email,
      msg: "OTP sent to email successfully ✅",
    });
  } catch (error) {
    next(error);
  }
};

// ── VERIFY OTP ────────────────────────────────────────
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, hash } = req.body;

    // 1. validate fields
    if (!email || !otp || !hash) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. split hash → hashedOTP + expires
    const [hashedOTP, expires] = hash.split(":");

    console.log("=== VERIFY OTP ===");
    console.log("hash received:", hash);
    console.log("hashedOTP:", hashedOTP);
    console.log("expires:", expires, typeof expires);

    // 3. check if otp expired
    if (Date.now() > Number(expires)) {
      return res.status(410).json({ message: "OTP Expired" });
    }

    // 4. verify otp
    const data = `${email}.${String(otp)}.${expires}`;
    console.log("otp:", otp, typeof otp);
    console.log("data rebuilt:", data);
    console.log("checkHash:", hashOTP(data));
    console.log("match?", hashOTP(data) === hashedOTP);
    const isValid = verifyOTP(hashedOTP, data);
    console.log("isValid:", isValid);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // 5. find or create user
    let user;
    let isNewUser = false;
    try {
      user = await User.findOne({ email });
    } catch (error) {
      return next(error);
    }

    if (!user) {
      isNewUser = true;
      user = await User.create({ email, activateUser: true });
    } else {
      user.activateUser = true;
      await user.save();
    }

    // 6. generate tokens
    const payload = { id: user._id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateToken(payload);

    // 7. store refresh token in db
    await storeRefreshToken(user._id, refreshToken);

    // 8. send tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "OTP verified successfully",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        activateUser: user.activateUser,
      },
      inNewUser: !user.name,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// ── LOGOUT ────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    console.log("Cookie refreshToken:", refreshToken); // ✅

    let decodedToken;
    try {
      decodedToken = verifyRefreshToken(refreshToken);
      console.log("decodedToken:", decodedToken); // ✅
    } catch (err) {
      console.log("jwt verify error:", err.message); // ✅
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const storedToken = await findRefreshToken(decodedToken.id, refreshToken);
    console.log("storedToken:", storedToken); // ✅ is this null?

    if (!storedToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // find user
    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate new tokens
    const payload = { id: user._id, email: user.email, role: user.role };
    const { accessToken, refreshToken: newRefreshToken } =
      generateToken(payload);

    // update refresh token in db
    await updateRefreshToken(decodedToken.id, refreshToken, newRefreshToken);

    // set new cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    next(error);
  }
};
