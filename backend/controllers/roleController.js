import { Role } from "../models/role.js";

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
    console.log(req.body);
    const role = await Role.create({ name, permissions });
    res.status(200).json({
      success: true,
      message: "Role created successfully",
      role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Edit a role
export const editRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
