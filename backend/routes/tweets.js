const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');


// GET home page (renders search form)
router.get('/', (req, res) => {
  res.render('index');
});

// POST to search for tweets
router.post('/search', async (req, res) => {
  const { search, location, minLikes, minRetweets, sentiment } = req.body;
  const query = {};

  if (search) query.content = { $regex: search, $options: 'i' };
  if (location) query.location = { $regex: location, $options: 'i' };
  if (minLikes) query.likes = { $gte: Number(minLikes) };
  if (minRetweets) query.retweetCount = { $gte: Number(minRetweets) };
  if (sentiment && sentiment !== 'both') query.sentiment = sentiment;

  try {
    const tweets = await Tweet.find(query);
    res.render('../views/results', { tweets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
