import jwt from "jsonwebtoken";
import { RefreshToken } from "../auth/refreshToken.model.js";
import env from "dotenv";

env.config();

// generate access + refresh token
export const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// store refresh token in db
export const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await RefreshToken.create({ userId, token: refreshToken });
  } catch (error) {
    throw error;
  }
};

// verify access token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// find refresh token in db
export const findRefreshToken = async (userId, token) => {
  return await RefreshToken.findOne({ token }).lean();
};

// ── UPDATE REFRESH TOKEN ──────────────────────────────
// replaces old refresh token with new one in db
export const updateRefreshToken = async (userId, oldToken, newToken) => {
  try {
    await RefreshToken.findOneAndUpdate(
      { userId, token: oldToken }, // find by userId + old token
      { token: newToken }, // replace with new token
      { new: true },
    );
  } catch (error) {
    throw error;
  }
};

// ── DELETE REFRESH TOKEN ──────────────────────────────
// used when user logs out
export const deleteRefreshToken = async (token) => {
  try {
    await RefreshToken.findOneAndDelete({ token });
  } catch (error) {
    throw error;
  }
};
