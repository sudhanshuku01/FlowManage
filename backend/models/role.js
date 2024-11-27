import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
  },
});

export const Role = mongoose.model("Role", roleSchema);
