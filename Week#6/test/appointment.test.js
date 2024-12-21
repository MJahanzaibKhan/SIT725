const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");

describe("Appointment Model Tests", () => {
  beforeAll(() => {
    
    const url = "mongodb://127.0.0.1/appointment_test";
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    
    await mongoose.connection.close();
  });

  
  it("should create a valid appointment", async () => {
    const appointmentData = {
      patientName: "John Doe",
      doctorId: new mongoose.Types.ObjectId(),
      appointmentDate: new Date("2024-12-25T10:00:00Z"),
      reason: "Check-up",
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    
    expect(appointment.patientName).toBe("John Doe");
    expect(appointment.doctorId).toBeDefined();
    expect(appointment.appointmentDate).toEqual(
      new Date("2024-12-25T10:00:00Z")
    );
    expect(appointment.reason).toBe("Check-up");
    expect(appointment).toHaveProperty("createdAt"); 
  });

  
  it("should throw validation error if patientName is missing", async () => {
    const appointmentData = {
      doctorId: new mongoose.Types.ObjectId(),
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
    expect(error.errors.patientName).toBeDefined(); 
  });

  
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
    expect(error.errors.doctorId).toBeDefined(); 
  });

  
  it("should throw validation error for invalid appointmentDate format", async () => {
    const appointmentData = {
      patientName: "John Doe",
      doctorId: new mongoose.Types.ObjectId(),
      appointmentDate: "invalid-date", 
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
    expect(error.errors.appointmentDate).toBeDefined(); 
  });

  
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
