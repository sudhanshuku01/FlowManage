import express from "express";
import {
  createRole,
  editRole,
  getRoles,
} from "../controllers/roleController.js";

const router = express.Router();

router.get("/", getRoles);
router.post("/", createRole);
router.put("/:id", editRole);

export default router;
