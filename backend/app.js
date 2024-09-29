const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tweetsRouter = require('./routes/tweets');
const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/twitter_data')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const path = require('path');

// Set view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, '../views'));

// Other middleware and routes setup

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/",(req,res)=>{
    res.send("You are at root path");
});

app.use('/tweets', tweetsRouter);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
