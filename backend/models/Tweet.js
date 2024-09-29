const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  username: String,
  location: String,
  content: String,
  likes: Number,
  retweetCount: Number,
  sentiment: String,
  date: Date,
});

module.exports = mongoose.model('Tweet', tweetSchema);
