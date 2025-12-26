const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    firebaseUrl: {
      type: String,
      required: true
    },

    firebasePath: {
      type: String,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded"
    },

    sensitivityResult: {
      type: String,
      enum: ["safe", "flagged", "unknown"],
      default: "unknown"
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    mimeType: String,

    size: {
      type: Number // bytes
    },

    duration: {
      type: Number // seconds
    }
  },
  {
    timestamps: true
  }
);

videoSchema.index({ organizationId: 1, createdAt: -1 });

module.exports = mongoose.model("Video", videoSchema);