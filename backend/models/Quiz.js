const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    questions: {
      type: [questionSchema],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
