const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User
const Trip = require('../models/itinerary-model').Trip

// NEW USER FORM
app.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

// // SHOW SINGLE TRIP PAGE
// app.get('/:userId/trips/:tripId', async (req, res) => {
//   //find the user (the parent doc) in db by its id
//   const user = await User.findById(req.params.userId)
//   //find the trip the user has embedded
//   const trip = user.trips.id(req.params.tripId)
//   res.render(`trips/trips_show.ejs`, {trip})
// })

// SHOW USER PAGE
app.get('/:userId', async(req, res) => {
  //find the user by id and then add tweet later in post
  let user = await User.findById(req.params.userId)
  res.render('users/show.ejs', {user})
})

// CREATE NEW USER
app.post('/', (req, res) => {
  User.create(req.body)
    .then(newUser => {
      console.log("NEW USER" + newUser);
      res.redirect(`/users/${newUser._id}`);
    })
    .catch(err => {
      console.log(err);
      // Handle the error appropriately (e.g., send an error response)
    });
});

// CREATE NEW ITINERARY (POST)
app.post('/:userId/trips', async (req, res) => {
  // console.log(req.body)
  // store new tweet in memory with data from req.body
  try {
    const newTrip = await Trip.create({
      tripName: req.body.tripName,
      destination: req.body.destination,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      guests: req.body.guests,
      reason: req.body.reason,
      transportation: req.body.transportation
    })
  
    //find the user in the db
    const user = await User.findById(req.params.userId)
      // console.log(user, "USER", newTweet, "NEW TWEET")
      //parent.child.push | document.subdocument.push
    user.trips.push(newTrip)
    await user.save()
    console.log(req.body)
    res.redirect(`/users/${user.id}`)
  } catch (err) {
    console.log(err.message)
    res.send(err.message)
  }
})

// UPDATE ITINERARY (PUT)
app.put('/:userId/trips/:tripId', async (req, res) => {
  //set the value of the user and tweet ids
  const userId = req.params.userId
  const tripId = req.params.tripId
  //find the user (the parent doc) in db by its id
  const user = await User.findById(userId)
  //find the tweet the user has embedded
  const foundTrip = user.trips.id(tripId)
  // foundTrip.trip = await req.body.trip
  await user.save()
  res.redirect(`/users/${user.id}`)
})


// DELETE ITINERARY (DELETE)
app.delete('/:userId/trips/:tripsId', async (req, res) => {
  //set the value of the user and tweet ids
  const userId = req.params.userId
  const tripsId = req.params.tripsId
  //find the user (the parent doc) in db by its id
  const foundUser = await User.findById(userId)
  //find and delete the embedded trip in the user
  await foundUser.trips.id(tripsId).deleteOne()
  //update trip text and save the user
  await foundUser.save()
  res.redirect(`/users/${foundUser.id}`)
})

module.exports = app