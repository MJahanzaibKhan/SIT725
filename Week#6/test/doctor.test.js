const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Doctor = require("../models/Doctor");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const url = "mongodb://127.0.0.1/doctor";
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Doctor Model Tests", () => {
  it("should create and save a doctor successfully", async () => {
    const doctorData = {
      name: "Dr. John Doe",
      specialty: "Cardiologist",
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    const savedDoctor = await Doctor.findOne({ name: "Dr. John Doe" });
    expect(savedDoctor).toBeTruthy();
    expect(savedDoctor.name).toBe("Dr. John Doe");
    expect(savedDoctor.specialty).toBe("Cardiologist");
  });

  it("should throw validation error if name or specialty is missing", async () => {
    const invalidDoctor = new Doctor({ name: "Dr. Missing Specialty" });
    try {
      await invalidDoctor.save();
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.errors.specialty).toBeDefined();
    }

    const invalidDoctor2 = new Doctor({ specialty: "Neurologist" });
    try {
      await invalidDoctor2.save();
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.errors.name).toBeDefined();
    }
  });

  it("should find a doctor by specialty", async () => {
    const doctorData = {
      name: "Dr. Sarah Lee",
      specialty: "Orthopedist",
    };
    const doctor = new Doctor(doctorData);
    await doctor.save();

    const foundDoctor = await Doctor.findOne({ specialty: "Orthopedist" });
    expect(foundDoctor).toBeTruthy();
    expect(foundDoctor.name).toBe("Dr. Sarah Lee");
  });

  it("should throw validation error if the name exceeds the maximum length", async () => {
    const invalidDoctor = new Doctor({
      name: "Dr. ".repeat(50), // Long name
      specialty: "Pediatrician",
    });

    try {
      await invalidDoctor.save();
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.errors.name).toBeDefined();
    }
  });

  it("should throw error for duplicate doctor name", async () => {
    const doctorData = { name: "Dr. Jane Doe", specialty: "Dermatologist" };
    await new Doctor(doctorData).save();

    const duplicateDoctor = new Doctor(doctorData);

    try {
      await duplicateDoctor.save();
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.code).toBe(11000); // Duplicate key error code
    }
  });

  it("should find a doctor by name and specialty", async () => {
    const doctorData = { name: "Dr. Alex Smith", specialty: "Cardiologist" };
    await new Doctor(doctorData).save();

    const foundDoctor = await Doctor.findOne({
      name: "Dr. Alex Smith",
      specialty: "Cardiologist",
    });

    expect(foundDoctor).toBeTruthy();
    expect(foundDoctor.name).toBe("Dr. Alex Smith");
    expect(foundDoctor.specialty).toBe("Cardiologist");
  });

  it("should find a doctor using a case-insensitive query", async () => {
    const doctorData = { name: "Dr. Katherine Lane", specialty: "Surgeon" };
    await new Doctor(doctorData).save();

    const foundDoctor = await Doctor.findOne({
      name: { $regex: "dr. katherine lane", $options: "i" },
    });

    expect(foundDoctor).toBeTruthy();
    expect(foundDoctor.name).toBe("Dr. Katherine Lane");
  });
});
