const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// ✅ CORS FIX (VERY IMPORTANT)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

app.options("*", cors());

app.use(express.json());

// ✅ DATABASE CONNECTION
const db = new sqlite3.Database("./phishguard.db", (err) => {
  if (err) {
    console.error("DB Error:", err.message);
  } else {
    console.log("SQLite Connected");
  }
});

// ✅ CREATE TABLE
db.run(`CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT,
  result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// ✅ QUESTIONS API
app.get("/questions", (req, res) => {
  const questions = [
    {
      message: "Your bank account is locked! Click http://fakebank.com to verify.",
      isPhishing: true,
      explanation: "Urgency + suspicious link = phishing"
    },
    {
      message: "Your Amazon order has been shipped.",
      isPhishing: false,
      explanation: "Normal notification"
    },
    {
      message: "Win ₹10,000 now! Click here immediately!",
      isPhishing: true,
      explanation: "Too good to be true = phishing"
    },
    {
      message: "Verify your account within 24 hours to avoid suspension.",
      isPhishing: true,
      explanation: "Urgency + threat = phishing"
    },
    {
      message: "Meeting scheduled at 3 PM today.",
      isPhishing: false,
      explanation: "Normal internal communication"
    }
  ];

  res.json(questions);
});

// ✅ CHECK API
app.post("/check", (req, res) => {
  const { url } = req.body;

  let result = "Safe";

  if (
    url.includes("@") ||
    url.includes("login") ||
    url.includes("verify") ||
    url.includes("bank")
  ) {
    result = "Phishing";
  }

  db.run(
    "INSERT INTO reports (url, result) VALUES (?, ?)",
    [url, result],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }
      res.json({ result });
    }
  );
});

// ✅ ROOT ROUTE (IMPORTANT FOR RENDER)
app.get("/", (req, res) => {
  res.send("PhishGuard Backend Running 🚀");
});

// ✅ PORT FIX (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});