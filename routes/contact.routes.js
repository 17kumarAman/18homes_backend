// ========================= ROUTES =========================

// contact.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createContact,
  getMyContacts,
  getContactById,
  deleteContact,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", protect, createContact);
router.get("/", protect, getMyContacts);
router.get("/:id", protect, getContactById);
router.delete("/:id", protect, deleteContact);

export default router;
