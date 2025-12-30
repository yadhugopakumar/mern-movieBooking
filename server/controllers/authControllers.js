import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {User} from "../models/userModel.js";
/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // allow only valid roles
    const userRole =
      role && ["user", "admin", "owner"].includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

/* ================= PROFILE ================= */
export const profile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({ user });
};

/* ================= CHECK USER ================= */
export const checkUser = async (req, res) => {
  res.status(200).json({ message: "User authenticated", user: req.user });
};

/* ================= CHECK ADMIN ================= */
export const checkAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access denied" });
  }
  res.status(200).json({ message: "Admin access granted" });
};
