// ========================= CONTROLLERS =========================

// auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendResponse from "../utils/apiResponse.js";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, userType, address } = req.body;

    // ================= CHECK EXISTING USER =================
    const exists = await User.findOne({ email });
    if (exists) {
      return sendResponse(res, 409, false, "Email already registered");
    }

    // ================= CREATE USER =================
    const user = await User.create({
      name,
      email,
      phone,
      password,
      userType,
      address,
    });

    // ================= REMOVE SENSITIVE DATA =================
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.kyc;

    // ================= RESPONSE =================
    return sendResponse(
      res,
      201,
      true,
      "Registration successful",
      userResponse
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ================= CHECK USER =================
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    // ================= BLOCK CHECK =================
    if (user.isBlocked) {
      return sendResponse(res, 403, false, "Your account has been blocked");
    }

    // ================= PASSWORD MATCH =================
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    // ================= UPDATE LAST LOGIN =================
    user.lastLogin = new Date();
    await user.save();

    // ================= JWT TOKEN =================
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ================= CLEAN USER DATA =================
    const userData = user.toObject();
    delete userData.password;
    delete userData.kyc;

    // ================= RESPONSE =================
    return sendResponse(res, 200, true, "Login successful", {
      token,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, error.message);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "savedProperties",
        select: "title price images address purpose propertyType",
      })
      .select("-password -kyc");

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "Profile fetched successfully", user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, userType, address } = req.body;

    // ================= BUILD UPDATE OBJECT =================
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatar) updates.avatar = avatar;
    if (userType) updates.userType = userType;

    // ================= ADDRESS UPDATE =================
    if (address && typeof address === "object") {
      updates.address = {};

      if (address.houseNo) updates.address.houseNo = address.houseNo;
      if (address.street) updates.address.street = address.street;
      if (address.locality) updates.address.locality = address.locality;
      if (address.city) updates.address.city = address.city;
      if (address.district) updates.address.district = address.district;
      if (address.state) updates.address.state = address.state;
      if (address.pincode) updates.address.pincode = address.pincode;
    }

    // ================= UPDATE USER =================
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -kyc");

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "Profile updated successfully", user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};