const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    accommodations: [accommodationSchema],
    address: String,
    dates: [dateSchema],
    destinations: [destinationSchema],
    guests: String,
    pois: [poiSchema],
    reason: String,
    tripName: String,
    packLists: [packingListSchema]
}, {timestamps: true})

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  //embed itinerary in user
  trips: [tripSchema],
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
const Trip = mongoose.model("Trip", tripSchema)

module.exports = {User, Trip}