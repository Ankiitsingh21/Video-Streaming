const VideoService = require("../services/video-service");
const streamVideo = require("../utils/streamVideo");

class VideoController {
  async upload(req, res) {
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

  async list(req, res) {
    const videos = await VideoService.getVideos(req.user.organizationId);
    res.json({ success: true, videos });
  }

  async stream(req, res) {
    await streamVideo(req, res);
  }
}

module.exports = new VideoController();
