const VideoRepository = require("../repository/video-repository");
const { io } = require("../sockets");

class VideoProcessingService {
  async process(videoId) {
    try {
      await VideoRepository.updateById(videoId, {
        status: "processing",
        progress: 10
      });

      io.emit("video:progress", { videoId, progress: 10 });

      // simulate sensitivity analysis
      await this.delay(2000);
      await VideoRepository.updateById(videoId, { progress: 50 });
      io.emit("video:progress", { videoId, progress: 50 });

      // simple mock logic
      const sensitivityResult = Math.random() > 0.8 ? "flagged" : "safe";

      await this.delay(2000);
      await VideoRepository.updateById(videoId, {
        status: "processed",
        progress: 100,
        sensitivityResult
      });

      io.emit("video:done", {
        videoId,
        progress: 100,
        sensitivityResult
      });
    } catch (err) {
      await VideoRepository.updateById(videoId, {
        status: "failed"
      });
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new VideoProcessingService();
