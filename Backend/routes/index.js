const express = require('express');

const auth = require('./v1/auth-route');
const video = require('./v1/video-route')

const router = express.Router();

router.use('/auth', auth);
router.use('/video',video);

module.exports = router;
