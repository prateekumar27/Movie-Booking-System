import crypto from "crypto";
import env from "dotenv";

env.config();

// generate 4 digit otp
export const generateOTP = () => {
  return crypto.randomInt(1000, 9999);
};

// hash data (email + otp + expires)
export const hashOTP = (data) => {
  console.log("HASHING_SECRET used:", process.env.HASHING_SECRET); // add this
  return crypto
    .createHmac("sha256", process.env.HASHING_SECRET)
    .update(String(data))
    .digest("hex");
};

// verify otp — compare hash
export const verifyOTP = (hashedOTP, data) => {
  const checkHash = hashOTP(data);
  console.log("verifyOTP checkHash:", checkHash); // add this
  console.log("verifyOTP hashedOTP:", hashedOTP);
  return checkHash === hashedOTP;
};
