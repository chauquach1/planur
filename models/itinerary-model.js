const mongoose = require('mongoose')

const poiSchema = new mongoose.Schema({
  name: String,
  address: String,
  arrival: String,
  departure: String,
  phoneNumber: String,
  email: String,
  type: String,
  interest: String,
  transportation: String,
  resNum: String,
  notes: String
}, {timestamps: true})

const accommodationSchema = new mongoose.Schema({
  name: String,
  type: String,
  checkIn: String,
  checkOut: String,
  address: String,
  phoneNumber: String,
  email: String,
  resNum: String
}, {timestamps: true})

const stopSchema = new mongoose.Schema({
    stopName: String,
    address: String,
    arrival: String,
    departure: String,
    type: String,
    transportation: String,
    interest: String,
    resNum: String,
    notes: String
}, {timestamps: true})

const dateSchema = new mongoose.Schema({
  arrival: String,
  departure: String
}, {timestamps: true})

const packListsSchema = new mongoose.Schema({
  clothes:{
      shirts :Boolean,
      pants :Boolean,
      shorts :Boolean,
      sweater :Boolean,
      underwear :Boolean
  },
  luggage:{
      backpack: Boolean,
      carryon: Boolean,
      dufflebag: Boolean,
      suitcase: Boolean,
      garmentbag: Boolean
  },
  toiletries:{
      toothbrush: Boolean,
      toothpaste: Boolean,
      shampoo: Boolean,
      conditioner: Boolean,
      sunscreen: Boolean
  },
  miscellaneous:{
      cellphone: Boolean,
      laptop: Boolean,
      tablet: Boolean,
      passport: Boolean,
      medication: Boolean
  },
  emergencyContact: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    address: String,
    relationship: String
  }
},{timestamps: true})




const tripSchema = new mongoose.Schema({
    accommodations: [accommodationSchema],
    address: String,
    destination: String,
    startDate: String,
    endDate: String,
    guests: String,
    stops: [stopSchema],
    reason: String,
    transportation: String,
    tripName: String,
    packLists: packListsSchema
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
const Packlists = mongoose.model('Packlists', packListsSchema)

module.exports = {User, Trip, Stop, Accommodation, Poi, Packlists}