require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const PORT = 3000;

const User = require('./models/itinerary-model').User
const Trip = require('./models/itinerary-model').Trip



// declare API variable and link API key from .env file
const mongoURI = process.env.MONGO_URI;


// mongo
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);


// Middleware
app.use(express.json()) //body-parser
app.use(express.urlencoded({ extended: true })); //body-parser
app.use(methodOverride('_method')); //methodOverride for delete
app.use(express.static('public')); //use static - unchanging resources


// Controllers
app.use('/users', require('./controllers/users'))

// Render Dashboard
app.get('/', (req, res) => {
  res.render('home.ejs')
})

const db = mongoose.connection
//create messages to check mongo connection
db.on('error', (err) => console.log(err.message + 'error with mongo connection'))
db.on('connected', () => console.log('mongo is connected'))
db.on('disconnected', () => console.log('mongo disconnected'))



// MongoDB Commands
// delete all users Documents
    // User.deleteMany({}).then((users) => {
    //   console.log(users)
    //   db.close()
    // })
// delete all trips documents
    // Trip.deleteMany({}).then((trips) => {
    //   console.log(trips);
    //   db.close()
    // })

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  console.log();
});