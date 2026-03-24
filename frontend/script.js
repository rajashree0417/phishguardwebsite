async function checkURL() {
  console.log("Button clicked");

  const url = document.getElementById("urlInput").value;

  const response = await fetch("https://phishguard.onrender.com/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  const data = await response.json();

  document.getElementById("result").innerText =
    "Result: " + data.result;
}