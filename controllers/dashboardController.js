// const app = require('express')();
// const User = require('../models/itinerary-model').User
// const Itinerary = require('../models/itinerary-model').Itinerary

// // NEW USER FORM
// app.get('/new', (req, res) => {
//   res.render('users/new.ejs')
// })

// // SHOW USER PAGE

// // CREATE NEW USER
// app.post('/', (req, res) => {
//   User.create(req.body)
//     .then(newUser => {
//       console.log(newUser, "NEW USER");
//       res.redirect(`/users/${newUser._id}`);
//     })
//     .catch(err => {
//       console.log(err);
//       // Handle the error appropriately (e.g., send an error response)
//     });
// });

// // CREATE NEW ITINERARY

// // UPDATE ITINERARY

// // DELETE ITINERARY

// module.exports = app