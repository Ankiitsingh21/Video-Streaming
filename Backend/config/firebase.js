const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const {FIREBASE_STORAGE_BUCKET}= require('../config/serverConfig');

const serviceAccount = require("../config/video-streaming-46d94-firebase-adminsdk-fbsvc-1641707422.json"); // keep in root or config

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();

/**
 * Upload file buffer to Firebase Storage
 */
async function uploadToFirebase(file) {
  const fileName = `videos/${uuidv4()}-${file.originalname}`;
  const firebaseFile = bucket.file(fileName);

  await firebaseFile.save(file.buffer, {
    metadata: {
      contentType: file.mimetype
    }
  });

  await firebaseFile.makePublic();

  return {
    url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    path: fileName
  };
}

module.exports = {
  uploadToFirebase,
  bucket
};
