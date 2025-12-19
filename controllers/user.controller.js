// ========================= user.controller.js =========================
import User from "../models/user.model.js";
import sendResponse from "../utils/apiResponse.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    sendResponse(res, 200, true, "Users fetched successfully", users);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User fetched successfully", user);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User updated successfully", user);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    sendResponse(
      res,
      200,
      true,
      `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};
