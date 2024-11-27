import express from "express";
import {
  createUser,
  editUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);

export default router;
