const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User
const Accommodation = require('../models/itinerary-model').Accommodation



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


// CREATE NEW ACCOMMODATION (POST)
app.post('/:userId/trips/:tripsId/accommodations', async (req, res) => {
  try {
    const newAccom = await Accommodation.create({
      name: req.body.accomName,
      type: req.body.accomType,
      address: req.body.accomAdd,
      phoneNumber: req.body.accomPhone,
      email: req.body.accomEmail,
      resNum: req.body.accomRes,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut
    })
  
    //find the accommodation in the db
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
    trip.accommodations.push(newAccom)
    
    await user.save()
    // console.log("New Accommodation:", newAccom)
    res.redirect(`/users/${user.id}/trips/${tripsId}`)
  } catch (err) {
    console.log(err.message)
    res.send(err.message)
  }
})


// UPDATE ACCOMMODATION (PUT)
app.put('/:userId/trips/:tripsId/accommodations/:accomId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const tripsId = req.params.tripsId;
      const accomId = req.params.accomId
  
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
      
      // Update accommodation details in browser
      accommodation.name = req.body.accomName;
      accommodation.type = req.body.accomType;
      accommodation.address = req.body.accomAdd;
      accommodation.phoneNumber = req.body.accomPhone;
      accommodation.email = req.body.accomEmail;
      accommodation.resNum = req.body.accomRes;
      accommodation.checkIn = req.body.checkIn;
      accommodation.checkOut = req.body.checkOut;
      
      // Update accommodation document
      try {
        const updatedAccom = await Accommodation.findByIdAndUpdate(accomId ,
          {
            name: req.body.accomName,
            type: req.body.accomType,
            address: req.body.accomAdd,
            phoneNumber: req.body.accomPhone,
            email: req.body.accomEmail,
            resNum: req.body.accomRes,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut
          },
          { new: true } // This option returns the updated document
        );
      
        if (updatedAccom) {
          console.log('Updated Accommodation:', updatedAccom);
        } else {
          console.log('Accommodation not found');
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
app.delete('/:userId/trips/:tripsId/accommodations/:accomId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const tripsId = req.params.tripsId;
    const accomId = req.params.accomId

    const user = await User.findById(userId);
    const trip = user.trips.id(tripsId);
    const accommodation = trip.accommodations.id(accomId)


    if (!user) {
      return res.status(404).send('User not found');
    }
    
    if (!trip) {
      return res.status(404).send('Trip not found');
    }

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation not found' });
    }

    console.log(accommodation);
    await accommodation.deleteOne()
    await user.save()
    res.redirect(`/users/${user.id}/trips/${trip.id}`)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
})

// CREATE NEW STOP


// CREATE NEW POI






// UPDATE STOP


// UPDATE POI











module.exports = app