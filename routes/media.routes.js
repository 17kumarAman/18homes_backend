import express from "express";
import { uploadMedia } from "../controllers/media.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // optional

const router = express.Router();

// JWT chahiye to protect rakho, warna hata do
router.post("/upload", protect, uploadMedia);

export default router;
