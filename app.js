// ========================= APP.JS =========================
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";
import mediaRoutes from "./routes/media.routes.js";

const app = express();

// ✅ Allow CORS for all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

app.use("/api/media", mediaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);

export default app;
