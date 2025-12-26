const Video = require("../models/video");

class VideoRepository {
  create(data) {
    return Video.create(data);
  }

  findById(id) {
    return Video.findById(id);
  }

  findByOrganization(organizationId) {
    return Video.find({ organizationId }).sort({ createdAt: -1 });
  }

  updateById(id, data) {
    return Video.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new VideoRepository();
