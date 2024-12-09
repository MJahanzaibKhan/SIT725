const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: Date,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
