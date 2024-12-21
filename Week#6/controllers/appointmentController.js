const Appointment = require("../models/Appointment");

// Controller function to create an appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientName, doctorId, appointmentDate, reason } = req.body;

    // Validate data
    if (!patientName || !doctorId || !appointmentDate || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientName,
      doctorId,
      appointmentDate,
      reason,
    });

    // Save the appointment in the database
    await newAppointment.save();

    // Send success response
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to render the appointment creation page (if necessary)
exports.renderAppointmentPage = (req, res) => {
  res.render("appointment"); // Assuming you're using a template engine (e.g., EJS)
};
