const express = require('express');
const app = express.Router();
const User = require('../models/itinerary-model').User;
const Packlists = require('../models/itinerary-model').Packlists;



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


// CREATE NEW PACKING LISTS (POST)
app.post('/:userId/trips/:tripsId/packLists', async (req, res) => {
  try {   
    const newPackList = await Packlists.create({
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
      }
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
    trip.packLists = newPackList;
    
    await user.save();
    console.log(Object.values(newPackList.clothes));
    res.redirect(`/users/${user.id}/trips/${tripsId}`);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});


// UPDATE PACKING LISTS (PUT)
app.put('/:userId/trips/:tripsId/packLists/:packId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const tripsId = req.params.tripsId;
      const packId = req.params.packId;
  
      const user = await User.findById(userId);
      const trip = user.trips.id(tripsId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      
      if (!trip) {
        return res.status(404).send('Trip not found');
      }
      const packList = trip.packLists
      if (!packList) {
        return res.status(404).json({ error: 'Pack lists not found' });
      }

      // Update lists details
        // clothes list
        packList.clothes.shirts = req.body.shirts;
        packList.clothes.pants = req.body.pants;
        packList.clothes.shorts = req.body.shorts;
        packList.clothes.sweater = req.body.sweater;
        packList.clothes.underwear = req.body.underwear;
        // luggage list
        packList.luggage.backpack = req.body.backpack;
        packList.luggage.carryon = req.body.carryon;
        packList.luggage.dufflebag = req.body.dufflebag;
        packList.luggage.suitcase = req.body.suitcase;
        packList.luggage.garmentbag = req.body.garmentbag;
        // toiletries list
        packList.toiletries.toothbrush = req.body.toothbrush;
        packList.toiletries.toothpaste = req.body.toothpaste;
        packList.toiletries.shampoo = req.body.shampoo;
        packList.toiletries.conditioner = req.body.conditioner;
        packList.toiletries.sunscreen = req.body.sunscreen;
        // miscellaneous list
        packList.miscellaneous.cellphone = req.body.cellphone;
        packList.miscellaneous.laptop = req.body.laptop;
        packList.miscellaneous.tablet = req.body.tablet;
        packList.miscellaneous.passport = req.body.passport;
        packList.miscellaneous.medication = req.body.medication;
        // console.log('Value of packList.clothes.shirts before PUT:', packList.clothes.shirts === true);  
      try {
        const updatedPackLists = await Packlists.findByIdAndUpdate(packId,
          {
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
            }
          },{ new: true } // This option returns the updated document
        );
      
        if (updatedPackLists) {
          // console.log('Value of packList.clothes.shirts AFTER PUT:', packList.clothes.shirts === true); 
          // console.log('Updated Pack lists:', updatedPackLists);
        } else {
          console.log('Pack lists not found');
        }
      } catch (error) {
        console.error('Error:', error);
      }
  
      await user.save();
      // console.log(Boolean(trip.packLists.clothes.shirts));
      // console.log(trip.packLists.clothes.shirts);
      // console.log(req.body.shirts);
      // console.log(typeof req.body.shirts);
      res.redirect(`/users/${user.id}/trips/${trip.id}`)
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
    }
  });


module.exports = app