// property.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
  toggleSaveProperty,
  getSavedProperties,
  getAllPropertiesAdmin,
  flagProperty,
} from "../controllers/property.controller.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// PROTECTED
router.post("/", protect, createProperty);
router.get("/my/properties", protect, getMyProperties);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.post("/:id/save", protect, toggleSaveProperty);
router.get("/my/saved", protect, getSavedProperties);

// ADMIN
router.get("/admin/all", protect, authorize("admin"), getAllPropertiesAdmin);
router.patch("/:id/flag", protect, authorize("admin"), flagProperty);

export default router;