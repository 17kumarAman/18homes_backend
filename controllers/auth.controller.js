// ========================= CONTROLLERS =========================

// auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendResponse from "../utils/apiResponse.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return sendResponse(res, 409, false, "Email already registered");
    }

    await User.create({ name, email, phone, password });
    return sendResponse(res, 201, true, "Registration successful");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    if (user.isBlocked) {
      return sendResponse(res, 403, false, "Your account has been blocked");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return sendResponse(res, 200, true, "Login successful", { token });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, error.message);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedProperties",
      "title price images address"
    );

    return sendResponse(res, 200, true, "Profile fetched", user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );

    return sendResponse(res, 200, true, "Profile updated", user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};