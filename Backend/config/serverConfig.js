const dotenv = require('dotenv');

dotenv.config();

module.exports={
        PORT:process.env.PORT,
        mongodb_url:process.env.mongodb_url,
        JWT_KEY:process.env.JWT_KEY,
        FIREBASE_STORAGE_BUCKET:process.env.FIREBASE_STORAGE_BUCKET
}