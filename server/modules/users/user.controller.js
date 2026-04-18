// controllers/user.controller.js
import User from "../users/user.model.js";

// ── CREATE USER ───────────────────────────────────────
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        activateUser: user.activateUser,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET ALL USERS ─────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET USER BY ID ────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── ACTIVATE / DEACTIVATE USER ────────────────────────

export const activateUser = async (req, res) => {
  try {
    const { name, phone } = req.body; // ✅ get name and phone

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, activateUser: true }, // ✅ update all fields
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User activated successfully",
      user: {
        _id: user._id,
        name: user.name, // ✅ remove the || "N/A" fallback
        email: user.email,
        phone: user.phone,
        activateUser: user.activateUser,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
