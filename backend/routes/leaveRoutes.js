import express from "express";
import {
  applyLeave,
  getLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave,
} from "../controllers/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, applyLeave);
router.get("/", protect, getLeaves); // ✅ use getLeaves, not getAllLeaves
router.get("/:id", protect, getLeaveById);
router.put("/:id/approve", protect, approveLeave);
router.put("/:id/reject", protect, rejectLeave);

export default router;
