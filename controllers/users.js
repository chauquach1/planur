const app = require('express')();
const User = require('../models/itinerary-model').User
const Trip = require('../models/itinerary-model').Trip

// NEW USER FORM
app.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

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
      console.log(newUser, "NEW USER");
      res.redirect(`/users/${newUser._id}`);
    })
    .catch(err => {
      console.log(err);
      // Handle the error appropriately (e.g., send an error response)
    });
});

// CREATE NEW ITINERARY
app.post('/:userId/trips', async (req, res) => {
  // console.log(req.body)
  // store new tweet in memory with data from req.body
  try {
    const newTrip = await Trip.create({
      tripName: req.body.tripName,
      destination: req.body.destination
    })
  
    //find the user in the db
    const user = await User.findById(req.params.userId)
      // console.log(user, "USER", newTweet, "NEW TWEET")
      //parent.child.push | document.subdocument.push
    user.trips.push(newTrip)
    await user.save()
    console.log(req.body.tripName)
    res.redirect(`/users/${user.id}`)
  } catch (err) {
    console.log(err.message)
    res.send(err.message)
  }
})

// UPDATE ITINERARY

// DELETE ITINERARY

module.exports = app