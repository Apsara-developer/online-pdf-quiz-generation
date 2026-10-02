# Online PDF Quiz Generation Application

A MERN-stack application that:
1. Uploads a PDF
2. Extracts text from the PDF
3. Generates multiple-choice quiz questions from the extracted text
4. Displays the quiz in React
5. Calculates and displays the score
6. Stores generated quiz data in MongoDB

## Tech Stack
- React + Vite
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer for PDF upload
- pdf-parse for PDF text extraction

## Requirements
- Node.js 20+ recommended
- MongoDB running locally or a MongoDB Atlas connection

## 1. Backend

Open a terminal:

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs at:
http://localhost:5000

## 2. Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend normally runs at:
http://localhost:5173

## MongoDB

Default local database:
mongodb://127.0.0.1:27017/pdf_quiz_db

You can change MONGO_URI in backend/.env.

## Project Flow

PDF Upload
  -> Express/Multer
  -> PDF text extraction
  -> Question generation
  -> MongoDB
  -> React quiz page
  -> Score calculation
  -> Result page

## Important

This version uses a local rule-based question generator so it does not require an external AI API key. It is designed to be easy to run and explain during an interview.
