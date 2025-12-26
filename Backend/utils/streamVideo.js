const axios = require("axios");
const VideoRepository = require("../repository/video-repository");

module.exports = async function streamVideo(req, res) {
  const video = await VideoRepository.findById(req.params.id);
  if (!video) return res.status(404).end();

  const range = req.headers.range;
  if (!range) {
    return res.redirect(video.firebaseUrl);
  }

  const response = await axios.get(video.firebaseUrl, {
    headers: { Range: range },
    responseType: "stream"
  });

  res.writeHead(response.status, response.headers);
  response.data.pipe(res);
};
