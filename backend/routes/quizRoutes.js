const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const Quiz = require("../models/Quiz");
const { generateQuestions } = require("../utils/generateQuestions");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

router.post("/generate", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file"
      });
    }

    const count = Math.min(
      Math.max(Number(req.body.count) || 5, 1),
      10
    );

    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.trim();

    if (!extractedText) {
      return res.status(400).json({
        message: "No readable text was found in the PDF"
      });
    }

    const questions = generateQuestions(extractedText, count);

    if (questions.length === 0) {
      return res.status(400).json({
        message:
          "The PDF does not contain enough suitable text to generate questions."
      });
    }

    const quiz = await Quiz.create({
      title: req.file.originalname.replace(/\.pdf$/i, ""),
      fileName: req.file.originalname,
      questions
    });

    res.status(201).json({
      message: "Quiz generated successfully",
      quizId: quiz._id,
      title: quiz.title,
      fileName: quiz.fileName,
      questions: quiz.questions
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Failed to generate quiz"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch quiz"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select("title fileName createdAt");

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch quizzes"
    });
  }
});

module.exports = router;
