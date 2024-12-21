const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Doctor = require("../models/Doctor"); // Adjust the path as needed

let mongoServer;

// Setup in-memory MongoDB before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const url = "mongodb://127.0.0.1/doctor"; // Adjust URL as needed
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Disconnect from in-memory database after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Test Case 1: Creating a new doctor
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

  // Test Case 2: Validation fails if required fields are missing
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

  // Test Case 3: Querying doctors
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
});
