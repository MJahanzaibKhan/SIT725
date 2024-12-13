const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  // Add more fields as necessary
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
