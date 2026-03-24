const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ SUPABASE POSTGRES CONNECTION (UNCHANGED)
const pool = new Pool({
  connectionString: "postgresql://postgres.opymwhentxetvnjrjxwm:Rajashree0417@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ TEST DB CONNECTION
pool.connect()
  .then(() => console.log("Connected to Supabase PostgreSQL ✅"))
  .catch(err => console.error("DB Connection Error:", err));


// ✅ QUESTIONS API (FIXED → 24 QUESTIONS)
app.get("/questions", (req, res) => {
  res.json([

    // EASY (8)
    { message: "Your bank account is locked! Click http://fakebank.com", isPhishing: true, explanation: "Urgency + fake link" },
    { message: "Amazon order shipped successfully.", isPhishing: false, explanation: "Normal notification" },
    { message: "Win ₹10,000 now! Click immediately!", isPhishing: true, explanation: "Too good to be true" },
    { message: "Meeting at 3 PM today.", isPhishing: false, explanation: "Normal communication" },
    { message: "Verify account urgently to avoid suspension.", isPhishing: true, explanation: "Threat tactic" },
    { message: "Your Netflix subscription renewed.", isPhishing: false, explanation: "Normal update" },
    { message: "Click here to claim your reward now!", isPhishing: true, explanation: "Suspicious reward" },
    { message: "Team meeting rescheduled to tomorrow.", isPhishing: false, explanation: "Normal info" },

    // MEDIUM (8)
    { message: "Update your password here: http://secure-login.net", isPhishing: true, explanation: "Fake login page" },
    { message: "Your package is out for delivery.", isPhishing: false, explanation: "Normal delivery update" },
    { message: "Suspicious login detected. Verify immediately.", isPhishing: true, explanation: "Urgency + fear" },
    { message: "Your electricity bill is ready.", isPhishing: false, explanation: "Normal billing" },
    { message: "Account will be deleted in 24 hrs!", isPhishing: true, explanation: "Pressure tactic" },
    { message: "Library book return reminder.", isPhishing: false, explanation: "Safe message" },
    { message: "Click to update banking details now.", isPhishing: true, explanation: "Sensitive info request" },
    { message: "Your class starts at 9 AM.", isPhishing: false, explanation: "Normal reminder" },

    // HARD (8)
    { message: "Security alert: unusual login attempt detected.", isPhishing: true, explanation: "Panic trick" },
    { message: "HR: Please review updated policy document.", isPhishing: false, explanation: "Legit communication" },
    { message: "Invoice attached. Please review urgently.", isPhishing: true, explanation: "Attachment phishing" },
    { message: "Zoom meeting link shared by your manager.", isPhishing: false, explanation: "Normal work message" },
    { message: "Reset password using secure portal now.", isPhishing: true, explanation: "Fake portal risk" },
    { message: "Your college timetable updated.", isPhishing: false, explanation: "Safe message" },
    { message: "Payment failed. Update card immediately.", isPhishing: true, explanation: "Money urgency" },
    { message: "Friend tagged you in a photo.", isPhishing: false, explanation: "Normal notification" }

  ]);
});


// ✅ CHECK API (STORES IN DATABASE)
app.post("/check", async (req, res) => {
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

  try {
    await pool.query(
      "INSERT INTO reports (url, result) VALUES ($1, $2)",
      [url, result]
    );

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// ROOT
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// SAVE REPORT
app.post("/report", async (req, res) => {
  const { url, result } = req.body;

  try {
    await pool.query(
      "INSERT INTO reports (url, result) VALUES ($1, $2)",
      [url, result]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving report");
  }
});

// SAVE SCORE
app.post("/save-score", async (req, res) => {
  const { score, total } = req.body;

  try {
    await pool.query(
      "INSERT INTO quiz_results (score, total) VALUES ($1, $2)",
      [score, total]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving score");
  }
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});