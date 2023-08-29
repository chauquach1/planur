const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User
const Stop = require('../models/itinerary-model').Stop



// GET ROUTE FOR ALL STOPS
app.get('/:userId/trips/:tripId/stops', async (req, res) => {
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


// CREATE NEW STOP (POST)
app.post('/:userId/trips/:tripsId/stops', async (req, res) => {
  try {   
    const newStop = await Stop.create({
      stopName: req.body.stopName,
      address: req.body.stopAdd,
      arrival: req.body.arrival,
      departure: req.body.departure,
      type: req.body.stopType,
      transportation: req.body.transportation,
      interest: req.body.interest,
      resNum: req.body.stopRes,
      notes: req.body.stopNotes
    })
    
    //find the stop in the db
    const userId = req.params.userId;
    const tripsId = req.params.tripsId;

    const user = await User.findById(userId);
    const trip = user.trips.id(tripsId);

    // Handle cases where user or trip is not found
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }

    //parent.child.push | document.subdocument.push
    trip.stops.push(newStop)
    
    await user.save()
    // console.log("STOP", newStop)
    res.redirect(`/users/${user.id}/trips/${tripsId}`)
  } catch (err) {
    console.log(err.message)
    res.send(err.message)
  }
})


// UPDATE ACCOMMODATION (PUT)
app.put('/:userId/trips/:tripsId/stops/:stopId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const tripsId = req.params.tripsId;
      const stopId = req.params.stopId
  
      const user = await User.findById(userId);
      const trip = user.trips.id(tripsId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      
      if (!trip) {
        return res.status(404).send('Trip not found');
      }

      const stop = trip.stops.id(req.params.stopId)
      if (!stop) {
        return res.status(404).json({ error: 'Accommodation not found' });
      }
      // Update trip details
      stop.name = req.body.stopName;
      stop.address = req.body.stopAdd;
      stop.type = req.body.stopType;
      stop.arrival = req.body.arrival;
      stop.departure = req.body.departure;
      stop.interest = req.body.interest;
      stop.transportation = req.body.transportation;
      stop.resNum = req.body.stopRes;
      stop.notes = req.body.stopNotes;
  
      try {
        const updatedStop = await Stop.findByIdAndUpdate(stopId,
          {
            name: req.body.stopName,
            address: req.body.stopAdd,
            type: req.body.stopType,
            arrival: req.body.arrival,
            departure: req.body.departure,
            interest: req.body.interest,
            transportation: req.body.transport,
            resNum: req.body.stopRes,
            notes: req.body.stopNotes
          },
          { new: true } // This option returns the updated document
        );
      
        if (updatedStop) {
          console.log('Updated Stop:', updatedStop);
        } else {
          console.log('Stop not found');
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

// DELETE ACCOMMODATION (DELETE)
app.delete('/:userId/trips/:tripsId/stops/:stopId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const tripsId = req.params.tripsId;
    const stopId = req.params.stopId

    const user = await User.findById(userId);
    const trip = user.trips.id(tripsId);
    const stop = trip.stops.id(stopId)


    if (!user) {
      return res.status(404).send('User not found');
    }
    
    if (!trip) {
      return res.status(404).send('Trip not found');
    }

    if (!stop) {
      return res.status(404).json({ error: 'Stop not found' });
    }

    await stop.deleteOne()
    await user.save()
    res.redirect(`/users/${user.id}/trips/${trip.id}`)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
})













module.exports = app