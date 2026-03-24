const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ SUPABASE POSTGRES CONNECTION
const pool = new Pool({
  connectionString: "postgresql://postgres:Rajashree0417@db.opymwhentxetvnjrjxwm.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ TEST DB CONNECTION
pool.connect()
  .then(() => console.log("Connected to Supabase PostgreSQL ✅"))
  .catch(err => console.error("DB Connection Error:", err));

// ✅ QUESTIONS API
app.get("/questions", (req, res) => {
  res.json([
    {
      message: "Your bank account is locked! Click http://fakebank.com",
      isPhishing: true,
      explanation: "Suspicious link + urgency"
    },
    {
      message: "Your Amazon order has been shipped.",
      isPhishing: false,
      explanation: "Normal notification"
    },
    {
      message: "Win ₹10,000 now! Click here immediately!",
      isPhishing: true,
      explanation: "Too good to be true"
    },
    {
      message: "Verify your account within 24 hours to avoid suspension.",
      isPhishing: true,
      explanation: "Urgency + threat"
    },
    {
      message: "Meeting scheduled at 3 PM today.",
      isPhishing: false,
      explanation: "Normal message"
    }
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

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});