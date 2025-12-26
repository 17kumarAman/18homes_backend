// user.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleBlockUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/block", toggleBlockUser);

export default router;