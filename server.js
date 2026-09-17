const express = require("express");
const path = require("path");
const { readDB, writeDB } = require("./db");
const questions = require("./data/questions.json");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// POST /login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });
  if (password !== "1234") return res.status(401).json({ error: "Invalid password" });
  const db = readDB();
  if (!db.users.find(u => u.username === username)) {
    db.users.push({ username, createdAt: new Date().toISOString() });
    writeDB(db);
  }
  res.json({ success: true, username });
});

// GET /questions
app.get("/questions", (req, res) => {
  // Send questions without correct answers
  const safe = questions.map(({ correctAnswer, ...rest }) => rest);
  res.json(safe);
});

// POST /submit-score
app.post("/submit-score", (req, res) => {
  const { username, answers } = req.body;
  if (!username || !answers) return res.status(400).json({ error: "Missing data" });

  let correct = 0;
  const subjectScores = {};
  questions.forEach((q, i) => {
    if (!subjectScores[q.subject]) subjectScores[q.subject] = { correct: 0, total: 0 };
    subjectScores[q.subject].total++;
    if (answers[i] === q.correctAnswer) { correct++; subjectScores[q.subject].correct++; }
  });

  const total = questions.length;
  const percentage = Math.round((correct / total) * 100);
  let performanceMessage = "Keep Practicing! 💪";
  if (percentage >= 90) performanceMessage = "Excellent! 🌟";
  else if (percentage >= 70) performanceMessage = "Good Job! 👏";
  else if (percentage >= 50) performanceMessage = "Average, Keep Going! 📚";

  const result = { username, totalQuestions: total, correctAnswers: correct, wrongAnswers: total - correct, percentage, subjectScores, performanceMessage, date: new Date().toISOString() };

  const db = readDB();
  db.scores.push(result);
  writeDB(db);

  // Send back results with correct answers for review
  res.json({ ...result, questions });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
