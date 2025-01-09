const Appointment = require("../models/Appointment");
const path = require("path");

// Create an appointment
exports.createAppointment = async (req, res) => {
  try {
    const { name, email, phone, appointmentDate } = req.body;

    // Validate input
    if (!name || !email || !phone || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      appointmentDate,
    });

    // Save to the database
    await newAppointment.save();

    // Emit real-time event
    req.io.emit("newAppointment", {
      message: "A new appointment has been created!",
      appointment: newAppointment,
    });

    // Redirect to home page
    res.redirect("/");
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Render the appointment creation page (optional if using a templating engine)
exports.renderAppointmentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/appointment.html"));
};
