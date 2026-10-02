import { useState } from "react";

const API_URL = "http://localhost:5000/api/quiz";

function App() {
  const [file, setFile] = useState(null);
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setQuiz(null);
    setScore(null);
    setAnswers({});
  }

  async function generateQuiz(event) {
    event.preventDefault();

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    setScore(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("count", count);

      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate quiz");
      }

      setQuiz(data);
      setAnswers({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionIndex, option) {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: option
    }));
  }

  function submitQuiz() {
    if (!quiz) {
      return;
    }

    let correct = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correct++;
      }
    });

    setScore(correct);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetQuiz() {
    setQuiz(null);
    setAnswers({});
    setScore(null);
    setFile(null);
    setError("");
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <p className="badge">MERN STACK PROJECT</p>
          <h1>Online PDF Quiz Generator</h1>
          <p className="subtitle">
            Upload a PDF, generate a quiz from its content, and test your
            knowledge instantly.
          </p>
        </div>
      </header>

      <main className="container">
        {!quiz && (
          <section className="card upload-card">
            <h2>Generate a Quiz</h2>
            <p className="muted">
              Choose a text-based PDF and select the number of questions.
            </p>

            <form onSubmit={generateQuiz}>
              <label className="file-box">
                <span className="file-icon">PDF</span>
                <strong>
                  {file ? file.name : "Choose your PDF file"}
                </strong>
                <small>
                  Maximum file size: 10 MB
                </small>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>

              <div className="form-row">
                <label>
                  Number of questions
                  <select
                    value={count}
                    onChange={(event) => setCount(event.target.value)}
                  >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="10">10</option>
                  </select>
                </label>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Quiz"}
                </button>
              </div>
            </form>

            {error && <div className="error">{error}</div>}
          </section>
        )}

        {quiz && (
          <section>
            <div className="quiz-header card">
              <div>
                <p className="badge">QUIZ READY</p>
                <h2>{quiz.title}</h2>
                <p className="muted">{quiz.questions.length} questions</p>
              </div>

              {score !== null && (
                <div className="score">
                  <span>Score</span>
                  <strong>
                    {score}/{quiz.questions.length}
                  </strong>
                </div>
              )}
            </div>

            <div className="questions">
              {quiz.questions.map((question, index) => (
                <article className="card question-card" key={index}>
                  <h3>
                    {index + 1}. {question.question}
                  </h3>

                  <div className="options">
                    {question.options.map((option, optionIndex) => (
                      <label
                        className={`option ${
                          answers[index] === option ? "selected" : ""
                        }`}
                        key={optionIndex}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() => selectAnswer(index, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>

                  {score !== null && (
                    <p
                      className={
                        answers[index] === question.answer
                          ? "answer correct"
                          : "answer wrong"
                      }
                    >
                      {answers[index] === question.answer
                        ? "Correct"
                        : `Correct answer: ${question.answer}`}
                    </p>
                  )}
                </article>
              ))}
            </div>

            <div className="actions">
              {score === null ? (
                <button
                  className="primary-button"
                  onClick={submitQuiz}
                >
                  Submit Quiz
                </button>
              ) : (
                <button className="primary-button" onClick={resetQuiz}>
                  Create Another Quiz
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      <footer>
        Online PDF Quiz Generation Application • React + Node.js + MongoDB
      </footer>
    </div>
  );
}

export default App;
