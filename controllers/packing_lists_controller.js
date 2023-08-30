const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User;
const Clothes = require('../models/itinerary-model').Clothes;
const Luggage = require('../models/itinerary-model').Luggage;
const Toiletries = require('../models/itinerary-model').Toiletries;
const Miscellaneous = require('../models/itinerary-model').Miscellaneous;
const EmergencyContact = require('../models/itinerary-model').EmergencyContact;



// GET ROUTE FOR ALL PACKING LISTS
app.get('/:userId/trips/:tripId/packLists', async (req, res) => {
  try {
      // Find the user by ID
      const user = await User.findById(req.params.userId);
      const trip = user.trips.id(req.params.tripId).populate('packLists');

      // Handle cases where user or trip is not found
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
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
app.post('/:userId/trips/:tripsId/packLists', async (req, res) => {
  try {   
    const packList = await PackingList.create({
      clothes: {
        shirts: req.body.shirts === 'on',
        pants: req.body.pants === 'on',
        shorts: req.body.shorts === 'on',
        sweater: req.body.sweater === 'on',
        underwear: req.body.underwear === 'on',
      },
      luggage: {
        backpack: req.body.backpack === 'on',
        carryon: req.body.carryon === 'on',
        dufflebag: req.body.dufflebag === 'on',
        suitcase: req.body.suitcase === 'on',
        garmentbag: req.body.garmentbag === 'on',
      },
      toiletries: {
        toothbrush: req.body.toothbrush === 'on',
        toothpaste: req.body.toothpaste === 'on',
        shampoo: req.body.shampoo === 'on',
        conditioner: req.body.conditioner === 'on',
        sunscreen: req.body.sunscreen === 'on',
      },
      miscellaneous: {
        cellphone: req.body.cellphone === 'on',
        laptop: req.body.laptop === 'on',
        tablet: req.body.tablet === 'on',
        passport: req.body.passport === 'on',
        medication: req.body.medication === 'on'
      },
      emergencyContacts: [
        { firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          address: req.body.address,
          relationship: req.body.relationship
        }
      ]
    });
    
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
    trip.packLists.push(packList)
    
    await user.save()
    res.redirect(`/users/${user.id}/trips/${tripsId}`)
  } catch (err) {
    console.log(err.message)
    res.send(err.message)
  }
});


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