import { User } from "../models/user.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// Get All Users API
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name permissions");
    res.status(200).json({
      success: true,
      message:'Found users successfully',
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create User API
export const createUser = async (req, res) => {
  try {
    const { name, email, status, role } = req.body;

    // Validate role
    const roleExists = await Role.findById(role);

    if (!roleExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role ID provided." });
    }

    const userExists = await User.findOne(email);
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist." });
    }

    const user = new User({ name, email, status, role });
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully.", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Edit a user
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({
      success: true,
      message: "User updated successfully.",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
