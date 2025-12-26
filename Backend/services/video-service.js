const VideoRepository = require("../repository/video-repository");
const videoProcessingService = require("./videoProcessing-service");
const { uploadToFirebase } = require("../config/firebase");

class VideoService {
  async uploadVideo({ file, title, description, user }) {
    // upload to firebase
    const firebaseResult = await uploadToFirebase(file);

    // create video record
    const video = await VideoRepository.create({
      title,
      description,
      firebaseUrl: firebaseResult.url,
      firebasePath: firebaseResult.path,
      uploadedBy: user.id,
      organizationId: user.organizationId,
      mimeType: file.mimetype,
      size: file.size,
      status: "uploaded",
      progress: 0
    });

    // async processing (non-blocking)
    videoProcessingService.process(video._id);

    return video;
  }

  getVideos(organizationId) {
    return VideoRepository.findByOrganization(organizationId);
  }

  getVideoById(id) {
    return VideoRepository.findById(id);
  }
}

module.exports = new VideoService();
