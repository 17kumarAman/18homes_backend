// ========================= property.model.js (UPDATED) =========================
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    purpose: {
      type: String,
      enum: ["sell", "rent"],
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["flat", "house", "plot", "shop", "office"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    area: {
      size: Number,
      unit: {
        type: String,
        default: "sqft",
      },
    },

    bedrooms: Number,
    bathrooms: Number,

    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"],
    },

    address: {
      city: String,
      state: String,
      locality: String,
      pincode: String,
    },

    images: [String],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ STATUS REMOVED - Seedha active hoga
    views: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Admin flag kar sakta hai
    isFlagged: {
      type: Boolean,
      default: false,
    },

    flagReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

propertySchema.index({ price: 1, "address.city": 1 });
propertySchema.index({ purpose: 1, propertyType: 1 });
propertySchema.index({ "address.city": 1, "address.locality": 1 });

export default mongoose.model("Property", propertySchema);