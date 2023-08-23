require('dotenv').config()
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const PORT = 3000;
const User = require('./models/itinerary-model').User
const Trip = require('./models/itinerary-model').Trip



// mongo
const mongoURI = process.env.MONGO_URI;
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);


// Middleware
app.use(express.json()) //body-parser
app.use(express.urlencoded({ extended: true })); //body-parser
app.use(methodOverride('_method')); //methodOverride for delete
app.use('/static', express.static('public'));
app.use(express.static('public')); //use static - unchanging resources


// Router
const tripsRouter = require('./controllers/trips_controller')
const usersRouter = require('./controllers/users_controller')

app.use('/users', usersRouter);
app.use('/users', tripsRouter);

// Controllers
// app.use('/users', require('./controllers/users_controller'))
// app.use('/users/:userId/trips', require('./controllers/trips_controller'))

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
//

// update multiple documents
    // User.updateMany({}).then((users) => {
    //   console.log(users);
    //   db.close()
    // })
    // Trip.updateMany({}).then((trips) => {
    //   console.log(trips);
    //   db.close()
    // })

// Read All Documents in a Collection
    // User.find().then((users) => {
    //   console.log(users);
    //   db.close();
    // })
    // Trip.find().then((trips) => {
    //   console.log(trips);
    //   db.close();
    // })

// Update collection


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  console.log();
});