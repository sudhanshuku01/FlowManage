import { Role } from "../models/role.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

//Get all role
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({
      success: true,
      message: "Found message successfully",
      roles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Create a role
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.create({ name, permissions });
    res.status(200).json({
      success: true,
      message: "Role created successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Edit a role
export const editRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRole = await Role.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    successResponse(res, "Role updated successfully", updatedRole);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
