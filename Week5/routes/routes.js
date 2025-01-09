const express = require("express");
const path = require("path");
const appointmentController = require("../controllers/appointmentController");
const feedbackController = require("../controllers/feedbackController");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

// Serve static files
router.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/html/index.html"))
);

// Appointment Routes
router.get("/appointment", appointmentController.renderAppointmentPage);
// Handle appointment creation
router.post("/appointment", appointmentController.createAppointment);

// Feedback Routes
router.get("/feedback", feedbackController.renderFeedbackPage);
router.post("/feedback", feedbackController.submitFeedback);

// Doctor Routes
router.get("/doctors", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/html/doctors.html"))
);
router.get("/api/doctors", doctorController.renderDoctorsPage);

module.exports = router;
