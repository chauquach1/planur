const mongoose = require('mongoose')

const itinerarySchema = new mongoose.Schema({
    tripName: String,
    destination: String,
}, {timestamps: true})

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  //embed itinerary in user
  itineraries: [itinerarySchema],
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
const Itinerary = mongoose.model("Itinerary", itinerarySchema)

module.exports = {User, Itinerary}