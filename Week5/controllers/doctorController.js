const path = require("path");
const Doctor = require("../models/Doctor");

exports.renderDoctorsPage = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors); // Send doctor data to the frontend.
  } catch (err) {
    res.status(500).send("Error fetching doctors");
  }
};
