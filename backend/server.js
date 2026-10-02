require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const quizRoutes = require("./routes/quizRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Online PDF Quiz Generation API is running"
  });
});

app.use("/api/quiz", quizRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
