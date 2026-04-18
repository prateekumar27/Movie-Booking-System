import User from "../users/user.model.js"
import bcrypt from "bcrypt"
import { generateOTP, hashOTP } from "../../utils/generateOtp.js"
import { generateToken, storeRefreshToken } from "../../utils/generateToken.js"
import sendEmail from "../../services/mailer.js"
import { otpverificationtemplate } from "../../Templates/mailTemplates.js"

// ── REGISTER ──────────────────────────────────────────
export const registerService = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error("Email already registered")

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  })

  // generate and send otp
  const otp = generateOTP()
  const hashedOtp = hashOTP(otp)

  // send otp email
  const content = otpverificationtemplate.replace("{otp}", otp)
  await sendEmail(email, "Verify your account", content)

  return { user, hashedOtp }
}

// ── LOGIN ─────────────────────────────────────────────
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error("User not found")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error("Invalid credentials")

  if (!user.activateUser) throw new Error("Account not activated")

  const payload = { id: user._id, email: user.email, role: user.role }
  const { accessToken, refreshToken } = generateToken(payload)

  await storeRefreshToken(user._id, refreshToken)

  return { user, accessToken, refreshToken }
}

// ── VERIFY OTP ────────────────────────────────────────
export const verifyOtpService = async (email, otp, hashedOtp) => {
  const checkHash = hashOTP(otp)
  if (checkHash !== hashedOtp) throw new Error("Invalid OTP")

  const user = await User.findOneAndUpdate(
    { email },
    { activateUser: true },
    { new: true }
  )

  return user
}