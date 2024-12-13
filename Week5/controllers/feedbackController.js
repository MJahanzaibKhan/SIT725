const path = require("path");
const Feedback = require("../models/Feedback");

exports.renderFeedbackPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/feedback.html"));
};

exports.submitFeedback = async (req, res) => {
  const { name, message, rating } = req.body;
  try {
    const feedback = new Feedback({ name, message, rating });
    await feedback.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error submitting feedback");
  }
};
