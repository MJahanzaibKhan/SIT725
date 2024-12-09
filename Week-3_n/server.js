const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hospital', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Models
const Appointment = require('./model/appointment');
const Feedback = require('./model/feedback');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, date } = req.body;
    const appointment = new Appointment({ name, email, date });
    await appointment.save();
    res.redirect('/appointment.html');
  } catch (err) {
    res.status(500).send('Error saving appointment.');
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, message } = req.body;
    const feedback = new Feedback({ name, message });
    await feedback.save();
    res.redirect('/feedback.html');
  } catch (err) {
    res.status(500).send('Error saving feedback.');
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
