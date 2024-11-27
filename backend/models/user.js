import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role", // Referencing Role model
    required: true,
  },
});

export const User = mongoose.model("User", userSchema);
