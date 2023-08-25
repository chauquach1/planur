const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User
const Trip = require('../models/itinerary-model').Trip
const Accommodation = require('../models/itinerary-model').Accommodation
const Stop = require('../models/itinerary-model').Stop
const Poi = require('../models/itinerary-model').Poi


// GET ROUTE FOR ONE ACCOMMODATION
app.get('/:userId/trips/:tripId/accommodations/:accomId', async (req, res) => {
  try {
      // Find the user by ID
      const user = await User.findById(req.params.userId);

      // Handle cases where user or trip is not found
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      const trip = user.trips.id(req.params.tripId);
      if (!trip) {
          return res.status(404).json({ error: 'Trip not found' });
      }

      const accommodation = trip.accommodations.id(req.params.accomId)
      if (!accommodation) {
        return res.status(404).json({ error: 'Accommodation not found' });
      }

      return res.render('trips/trip_show.ejs', { trip, user });
  } catch (err) {
      // Handle errors and provide an appropriate response
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET ROUTE FOR ALL ACCOMMODATIONS
app.get('/:userId/trips/:tripId/accommodations', async (req, res) => {
  try {
      // Find the user by ID
      const user = await User.findById(req.params.userId);

      // Handle cases where user or trip is not found
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      const trip = user.trips.id(req.params.tripId);
      if (!trip) {
          return res.status(404).json({ error: 'Trip not found' });
      }

      // Extract accommodations from the trip and render the view
      return res.render('trips/trip_show.ejs', { trip, user });
  } catch (err) {
      // Handle errors and provide an appropriate response
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
  }
});


// CREATE NEW ACCOMMODATION
app.post('/:userId/trips/:tripsId/accommodations', async (req, res) => {
  try {
    const newAccom = await Accommodation.create({
      name: req.body.accomName,
      type: req.body.accomType,
      address: req.body.accomAdd,
      phoneNumber: req.body.accomPhone,
      email: req.body.accomEmail,
      resNum: req.body.accomRes
    })
  
    //find the user in the db
    const userId = req.params.userId;
    const tripsId = req.params.tripsId;

    const user = await User.findById(userId);
    const trip = user.trips.id(tripsId);

    //parent.child.push | document.subdocument.push
    trip.accommodations.push(newAccom)
    await user.save()
    console.log(req.body)
    res.redirect(`/users/${user.id}/trips/${tripsId}`)
  } catch (err) {
    console.log(err.message)
    res.send(err.message)
  }
})


// UPDATE ACCOMMODATION (PUT)
app.put('/:userId/trips/:tripsId/accommodations', async (req, res) => {
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

      const accommodation = trip.accommodations.id(req.params.accomId)
      if (!accommodation) {
        return res.status(404).json({ error: 'Accommodation not found' });
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



// CREATE NEW STOP


// CREATE NEW POI






// UPDATE STOP


// UPDATE POI











module.exports = app