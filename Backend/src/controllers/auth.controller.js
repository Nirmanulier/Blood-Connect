import User from "../models/user.model.js";
import BloodBank from "../models/bloodbank.model.js";
import { generateToken } from "../utils/generateToken.js";

export const signupDonor = async (req, res) => {
  const { name, email, password, bloodGroup } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, bloodGroup });
    generateToken(user._id, "donor", res);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      role: "donor",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signupBank = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await BloodBank.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const bank = await BloodBank.create({ name, email, password });
    generateToken(bank._id, "bank", res);

    res.status(201).json({
      _id: bank._id,
      name: bank.name,
      email: bank.email,
      role: "bank",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body; // role: "donor" or "bank"
  try {
    const Model = role === "bank" ? BloodBank : User;
    const account = await Model.findOne({ email });

    if (!account || !(await account.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(account._id, role, res);
    res.status(200).json({ _id: account._id, name: account.name, email: account.email, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = (req, res) => {
  res.status(200).json({ id: req.userId, role: req.role });
};