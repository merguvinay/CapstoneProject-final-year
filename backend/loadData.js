const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();  // Create an instance of Sentiment

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/twitter_data')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define the Tweet schema
const tweetSchema = new mongoose.Schema({
    username: String,
    location: String,
    content: String,
    likes: Number,
    retweetCount: Number,
    sentiment: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);

// Function to analyze sentiment
function analyzeSentiment(text) {
    const result = sentiment.analyze(text);
    return result.score >= 0 ? 'positive' : 'negative'; // Simple classification
}

// Load and parse JSON data
const dataPath = path.join(__dirname, '../data/tweets.json');

fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        const tweetsData = JSON.parse(data);

        // Delete all existing tweets before inserting new data
        Tweet.deleteMany({})
            .then(() => {
                console.log('Existing tweets deleted from MongoDB.');

                // Map JSON data to the Tweet model schema
                const tweets = tweetsData.map(tweet => {
                    const tweetSentiment = analyzeSentiment(tweet.content);
                    return new Tweet({
                        username: tweet.user.username,
                        location: tweet.user.location || 'Unknown',
                        content: tweet.content,
                        likes: tweet.likeCount || 0,
                        retweetCount: tweet.retweetCount || 0,
                        sentiment: tweetSentiment,
                    });
                });

                // Insert new tweets into the database
                return Tweet.insertMany(tweets);
            })
            .then(() => {
                console.log('Tweets have been successfully inserted into MongoDB');
                mongoose.connection.close();
            })
            .catch(err => {
                console.error('Error handling data in MongoDB:', err);
                mongoose.connection.close();
            });
    } catch (jsonError) {
        console.error('Error parsing JSON data:', jsonError.message);
    }
});
