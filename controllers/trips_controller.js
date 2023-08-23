const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User
const Trip = require('../models/itinerary-model').Trip

// NEW TRIP FORM
app.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

// SHOW SINGLE TRIP PAGE
app.get('/:userId/trips/:tripId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId)
      const trip = user.trips.id(req.params.tripId)
      res.render(`trips/trips_show.ejs`, {trip})
    } catch (err) {
        console.log(err.message)
        res.send(err.message)
  }

  // const userId = req.params.userId; // Retrieve the userId parameter
  // const tripId = req.params.tripId; // Retrieve the tripId parameter
  // console.log(req.params, userId, tripId);
})

// SHOW ALL TRIPS PAGE
app.get('/:userId/trips', async (req, res) => {
  try {
    // Fetch user data from your database or any other data source
    const user = await User.findById(req.params.userId)
    
    // Render the template and pass the user data
    res.render('trips/all_trips_show', { user });
  } catch (err) {
      console.log(err.message)
      res.send(err.message)
  }
})

// CREATE NEW TRIP


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
      transportation: req.body.transportation,
      stops: req.body.stops
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