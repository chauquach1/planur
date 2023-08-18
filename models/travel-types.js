const mongoose = require ('mongoose');

const transportSchema = new mongoose.Schema({
    car: Boolean,
    flight: Boolean,
    cruise: Boolean,
    boat: Boolean,
    train: Boolean,
    walking: Boolean,
    publicTransport: Boolean,
    taxi: Boolean,
    rideShareApp: Boolean
})

const transportation = {
    car: false,
    flight: false,
    cruise: false,
    boat: false,
    train: false,
    walking: false,
    publicTransport: false,
    taxi: false,
    rideShareApp: false
}

const Transportation = mongoose.model('Transportation', transportSchema)

module.exports = {Transportation}