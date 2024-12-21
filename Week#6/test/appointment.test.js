const mongoose = require("mongoose");
const Appointment = require("../models/Appointment"); // Path to your model file

describe("Appointment Model Tests", () => {
  beforeAll(() => {
    // Connect to an in-memory MongoDB database before tests
    const url = "mongodb://127.0.0.1/appointment_test"; // Adjust URL as needed
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Close the connection after tests are finished
    await mongoose.connection.close();
  });

  // Test Case 1: Valid appointment creation
  it("should create a valid appointment", async () => {
    const appointmentData = {
      patientName: "John Doe",
      doctorId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date("2024-12-25T10:00:00Z"),
      reason: "Check-up",
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Assertions
    expect(appointment.patientName).toBe("John Doe");
    expect(appointment.doctorId).toBeDefined();
    expect(appointment.appointmentDate).toEqual(
      new Date("2024-12-25T10:00:00Z")
    );
    expect(appointment.reason).toBe("Check-up");
    expect(appointment).toHaveProperty("createdAt"); // check timestamp
  });

  // Test Case 2: Missing required fields (patientName)
  it("should throw validation error if patientName is missing", async () => {
    const appointmentData = {
      doctorId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date("2024-12-25T10:00:00Z"),
      reason: "Check-up",
    };

    const appointment = new Appointment(appointmentData);

    // Use `expect` to check for validation errors
    let error;
    try {
      await appointment.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.patientName).toBeDefined(); // Ensure the validation error is for the patientName field
  });

  // Test Case 3: Missing required fields (doctorId)
  it("should throw validation error if doctorId is missing", async () => {
    const appointmentData = {
      patientName: "John Doe",
      appointmentDate: new Date("2024-12-25T10:00:00Z"),
      reason: "Check-up",
    };

    const appointment = new Appointment(appointmentData);

    let error;
    try {
      await appointment.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.doctorId).toBeDefined(); // Ensure validation error is for doctorId
  });

  // Test Case 4: Invalid date format for appointmentDate
  it("should throw validation error for invalid appointmentDate format", async () => {
    const appointmentData = {
      patientName: "John Doe",
      doctorId: new mongoose.Types.ObjectId(),
      appointmentDate: "invalid-date", // Invalid date
      reason: "Check-up",
    };

    const appointment = new Appointment(appointmentData);

    let error;
    try {
      await appointment.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.appointmentDate).toBeDefined(); // Ensure validation error for invalid date format
  });

  // Test Case 5: Valid data with optional fields
  it("should create an appointment with valid data and have timestamps", async () => {
    const appointmentData = {
      patientName: "Jane Doe",
      doctorId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date("2024-12-26T11:00:00Z"),
      reason: "Routine check-up",
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    expect(appointment.createdAt).toBeDefined();
    expect(appointment.updatedAt).toBeDefined();
  });
});
