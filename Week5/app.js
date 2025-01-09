const express = require("express");
const http = require("http"); // Required to create an HTTP server
const socketIO = require("socket.io"); // Socket.IO library
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIO(server); // Attach Socket.IO to the server

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/hospital", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Middleware to make io available in routes
app.use((req, res, next) => {
  req.io = io; // Attach the io instance to the request object
  next();
});

// Use Routes
app.use("/", routes);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
