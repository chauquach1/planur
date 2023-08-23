const mongoose = require('mongoose')

const poiSchema = new mongoose.Schema({
  name: String,
  address: String,
  phoneNumber: String,
  email: String,
  type: String,
  interestLevel: String,
  transportation: String,
  resNum: String
}, {timestamps: true})

const accommodationSchema = new mongoose.Schema({
  name: String,
  type: String,
  accomDetails: [poiSchema]
}, {timestamps: true})

const stopSchema = new mongoose.Schema({
  name: String,
  stopDetails: [poiSchema]
}, {timestamps: true})

const dateSchema = new mongoose.Schema({
  arrival: String,
  departure: String
}, {timestamps: true})

const emergencyContactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  address: String,
  relationship: String
})

const packingListSchema = new mongoose.Schema({
  clothes: {
      shirts: Boolean,
      pants: Boolean,
      shorts: Boolean,
      sweater: Boolean,
      underwear: Boolean
  },
  baggage: {
      backpack: Boolean,
      carryon: Boolean,
      dufflebag: Boolean,
      suitcase: Boolean,
      garmentbag: Boolean
  },
  toiletries: {
      toothbrush: Boolean,
      toothpaste: Boolean,
      shampoo: Boolean,
      conditioner: Boolean,
      sunscreen: Boolean,
  },
  miscellaneous: {
    cellphone: Boolean,
    laptoptablet: Boolean,
    passport: Boolean,
    emergencyContacts: [emergencyContactSchema],
    medication: Boolean
  }
})

const tripSchema = new mongoose.Schema({
    accommodation: [accommodationSchema],
    address: String,
    destination: String,
    startDate: String,
    endDate: String,
    guests: String,
    stops: [poiSchema],
    reason: String,
    transportation: String,
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
const Trip = mongoose.model('Trip', tripSchema)
const Stop = mongoose.model('Stop', stopSchema)
const Accommodation = mongoose.model('Accommodation', accommodationSchema)
const Poi = mongoose.model('Poi', poiSchema)

module.exports = {User, Trip, Stop, Accommodation, Poi}