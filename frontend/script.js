let questions = [];
let current = 0;
let score = 0;

// LOAD QUESTIONS FROM BACKEND
async function loadQuestions() {
  try {
    const response = await fetch("https://phishguardwebsite.onrender.com/questions");
    const data = await response.json();

    // 🎯 DIFFICULTY LOGIC (IMPORTANT)
    const level = document.getElementById("difficulty").value;

    if (level === "easy") {
      questions = data.slice(0, 8);
    } else if (level === "medium") {
      questions = data.slice(8, 16);
    } else {
      questions = data.slice(16, 24);
    }

    current = 0;
    score = 0;

    showQuestion();
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// SHOW QUESTION
function showQuestion() {
  if (!questions.length || !questions[current]) {
    document.getElementById("questionBox").innerText = "Loading... ⏳";
    return;
  }

  document.getElementById("questionBox").innerText =
    questions[current].message;
}

// ANSWER BUTTONS
function answer(userChoice) {
  if (!questions.length) return;

  let q = questions[current];

  // Correct / Wrong display
  if (userChoice === q.isPhishing) {
    score++;
    document.getElementById("result").innerText = "🔥 Correct!";
  } else {
    document.getElementById("result").innerText = "💀 Wrong!";
  }

  // Explanation
  document.getElementById("explanation").innerText = "💡 " + q.explanation;

  // Score update
  document.getElementById("score").innerText = "Score: " + score;

  current++;

  if (current < questions.length) {
    setTimeout(() => {
      document.getElementById("result").innerText = "";
      document.getElementById("explanation").innerText = "";
      showQuestion();
    }, 2000);
  } else {
    alert("Final Score: " + score + "/" + questions.length);

    fetch("https://phishguardwebsite.onrender.com/save-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        score: score,
        total: questions.length
      })
    });
  }
}

// INVESTIGATE BUTTON
async function checkURL() {
  const url = document.getElementById("urlInput")?.value || "test.com";

  const response = await fetch("https://phishguardwebsite.onrender.com/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  const data = await response.json();

  alert("Result: " + data.result);
}

// 🔥 RELOAD WHEN DIFFICULTY CHANGES
document.getElementById("difficulty").addEventListener("change", loadQuestions);

// 🚀 INITIAL LOAD
loadQuestions();
async function reportURL() {
  console.log("REPORT CLICKED");

  const url = document.getElementById("urlInput")?.value || "unknown";

  await fetch("https://phishguardwebsite.onrender.com/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: url,
      result: "Reported by user"
    })
  });

  alert("Reported successfully 🚨");
}