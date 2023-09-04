require('dotenv').config()
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const PORT = 3000 || process.env.port;
const User = require('./models/itinerary-model').User;
const Trip = require('./models/itinerary-model').Trip;
const Stop = require('./models/itinerary-model').Stop;
const Accommodation = require('./models/itinerary-model').Accommodation;
const Poi = require('./models/itinerary-model').Poi;
const Packlists = require('./models/itinerary-model').Packlists;


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
const detailsRouter = require('./controllers/accommodations_controller')
const stopsRouter = require('./controllers/stops_controller')
const packListsRouter = require('./controllers/packing_lists_controller')

app.use('/users', usersRouter);
app.use('/users', tripsRouter);
app.use('/users', detailsRouter);
app.use('/users', stopsRouter);
app.use('/users', packListsRouter);


// Render Dashboard
// app.get('/users', (req, res) => {
//     const user = {};
//     res.render('home.ejs', {user})
// })

app.get('/', (req, res) => {
    const user = {};
    res.render('home.ejs', {user})
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
// delete all accommodation documents
    // Accommodation.deleteMany({}).then((accommodations) => {
    //   console.log(accommodations);
    //   db.close()
    // })
//
// delete all stop documents
    // Stop.deleteMany({}).then((stops) => {
    //   console.log(stops);
    //   db.close()
    // })
// delete all packing list documents
    // PackingList.deleteMany({}).then((list) => {
    //   console.log(list);
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
    // Accommodation.updateMany({}).then((accommodations) => {
    //   console.log(accommodations);
    //   db.close()
    // })
    // Stop.updateMany({}).then((stops) => {
    //   console.log(stops);
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