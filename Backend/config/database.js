const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(process.env.mongodb_url);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = { connect };