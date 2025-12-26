const express = require("express");
const router = express.Router();

const VideoService = require("../../services/video-service");
const streamVideo = require("../../utils/streamVideo");
const auth = require("../../middleware/auth");
const rbac = require("../../middleware/rbac");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Upload video (editor/admin)
 */
router.post(
  "/upload",
  auth,
  rbac("admin", "editor"),
  upload.single("video"),
  async (req, res) => {
    try {
      const video = await VideoService.uploadVideo({
        file: req.file,
        title: req.body.title,
        description: req.body.description,
        user: req.user
      });

      res.status(201).json({ success: true, video });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

/**
 * List videos (all roles)
 */
router.get(
  "/",
  auth,
  async (req, res) => {
    try {
      const videos = await VideoService.getVideos(req.user.organizationId);
      res.json({ success: true, videos });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/**
 * Stream video - MUST BE BEFORE /:id route
 */
router.get(
  "/:id/stream",
  auth,
  async (req, res) => {
    try {
      await streamVideo(req, res);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/**
 * Get single video - MUST BE AFTER /:id/stream route
 */
router.get(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const video = await VideoService.getVideoById(req.params.id);
      if (!video) {
        return res.status(404).json({ success: false, message: "Video not found" });
      }
      res.json({ success: true, video });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;