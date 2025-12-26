import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import sendResponse from "../utils/apiResponse.js";

// ================= CLOUDINARY DIRECT CONFIG =================
cloudinary.config({
  cloud_name: "domwj0m7s",
  api_key: "833515693898685",
  api_secret: "zS7ZGzL1UIwWtY49KhYQ3dKtXok",
});

// ================= MULTER MEMORY STORAGE =================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 15, // ✅ max 15 files
    fileSize: 50 * 1024 * 1024, // 50MB per file
  },
}).array("files", 15);

// ================= CONTROLLER =================
export const uploadMedia = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return sendResponse(res, 400, false, err.message);
      }

      if (!req.files || req.files.length === 0) {
        return sendResponse(res, 400, false, "No files uploaded");
      }

      if (req.files.length > 15) {
        return sendResponse(res, 400, false, "Maximum 15 files allowed");
      }

      const uploadedMedia = [];

      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith("video");

        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "18homes/media",
            resource_type: isVideo ? "video" : "image",
          }
        );

        uploadedMedia.push({
          url: result.secure_url,
          type: isVideo ? "video" : "image",
        });
      }

      return sendResponse(res, 201, true, "Media uploaded successfully", {
        count: uploadedMedia.length,
        media: uploadedMedia,
      });
    } catch (error) {
      return sendResponse(res, 500, false, error.message);
    }
  });
};
