const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User
const Trip = require('../models/itinerary-model').Trip

// NEW USERS FORM
app.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

// SHOW SINGLE TRIP PAGE
app.get('/:userId/trips/:tripId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      const trip = user.trips.id(req.params.tripId);
      res.render(`trips/trip_show.ejs`, {trip, user})
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


// CREATE NEW ITINERARY (POST)
app.post('/:userId/trips', async (req, res) => {
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
app.put('/:userId/trips/:tripsId', async (req, res) => {
try {
    const userId = req.params.userId;
    const tripsId = req.params.tripsId;

    const user = await User.findById(userId);
    const trip = user.trips.id(tripsId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    
    if (!trip) {
      return res.status(404).send('Trip not found');
    }
    // Update trip details
    trip.tripName = req.body.tripName;
    trip.startDate = req.body.startDate;
    trip.endDate = req.body.endDate;
    trip.destination = req.body.destination;
    trip.guests = req.body.guests;
    trip.reason = req.body.reason;
    trip.address = req.body.address;
    trip.transportation = req.body.transportation;

    try {
      const updatedTrip = await Trip.findOneAndUpdate(
        { _id: tripsId },
        {
          tripName: req.body.tripName,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          destination: req.body.destination,
          guests: req.body.guests,
          reason: req.body.reason,
          address: req.body.address,
          transportation: req.body.transportation
        },
        { new: true } // This option returns the updated document
      ).exec();
    
      if (updatedTrip) {
        console.log('Updated Trip:', updatedTrip);
      } else {
        console.log('Trip not found');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error
    }

    await user.save();

    res.redirect(`/users/${user.id}/trips/${trip.id}`)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});

// DELETE ITINERARY (DELETE)
app.delete('/:userId/trips/:tripsId', async (req, res) => {
  //set the value of the user and trip ids
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