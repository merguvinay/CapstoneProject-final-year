const express = require('express');
const Tweet = require('../models/Tweet');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});





router.post('/search', async (req, res) => {
    const { minLikes, minRetweets, sentiment } = req.body;
    const currentPage = parseInt(req.query.page) || 1;  // Default to the first page
    const tweetsPerPage = 15;  // Display 15 tweets per page

    // Set default values if input is missing
    const queryMinLikes = minLikes ? parseInt(minLikes) : 0;
    const queryMinRetweets = minRetweets ? parseInt(minRetweets) : 0;

    // Build query based on likes, retweets, and sentiment
    let query = {
        likes: { $gte: queryMinLikes },
        retweetCount: { $gte: queryMinRetweets }
    };

    // If sentiment is specified (and not 'both'), filter by sentiment
    if (sentiment !== 'both') {
        query.sentiment = sentiment;
    }

    try {
        // Retrieve tweets with pagination
        const tweets = await Tweet.find(query)
            .skip((currentPage - 1) * tweetsPerPage)
            .limit(tweetsPerPage);

        res.render('results', {
            tweets,
            currentPage,
            tweetsPerPage,
            minLikes: queryMinLikes,
            minRetweets: queryMinRetweets,
            sentiment
        });
    } catch (err) {
        console.error('Error retrieving tweets:', err);
        res.status(500).send('Error retrieving tweets');
    }
});

// Redirect back to search form if trying to "GET" from search page
router.get('/search', (req, res) => {
    res.redirect('/');  // Redirect to the home page or form
});

module.exports = router;
