module.exports = function validateFile(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }

  const allowedTypes = ["video/mp4", "video/mkv", "video/webm"];
  const maxSize = 200 * 1024 * 1024; // 200MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: "Invalid video format" });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({ message: "File too large" });
  }

  next();
};
