const BASE_URL = "http://localhost:5000";

let time = 0; // total seconds
let timerInterval = null;
let currentSessionId = null;
let isRunning = false;

const display = document.getElementById("timer");

// 🔹 Format time as HH:MM:SS
const updateDisplay = () => {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;

  display.textContent =
    `${hours < 10 ? "0" : ""}${hours}:` +
    `${minutes < 10 ? "0" : ""}${minutes}:` +
    `${seconds < 10 ? "0" : ""}${seconds}`;
};
const audio = document.getElementById("focusAudio");
// ▶️ START
document.getElementById("startBtn").onclick = async () => {
  if (isRunning) return;

  try {
    const res = await fetch(`${BASE_URL}/start-session`, {
      method: "POST"
    });

    const data = await res.json();
    currentSessionId = data.id;

    isRunning = true;

     audio.loop = true;
     audio.play();

    timerInterval = setInterval(() => {
      time++; // count up
      updateDisplay();
    }, 1000);

  } catch (err) {
    console.error("Error starting session:", err);
  }
};

// ⏸ PAUSE
document.getElementById("pauseBtn").onclick = () => {
  if (!isRunning) return;

  clearInterval(timerInterval);
  isRunning = false;
  audio.pause();
};

// 🔄 RESET (also ends session)
document.getElementById("resetBtn").onclick = async () => {
  clearInterval(timerInterval);
  isRunning = false;

   audio.pause();
  audio.currentTime = 0;

  if (currentSessionId) {
    await endSession();
  }

  time = 0;
  updateDisplay();
};

// ⏹ END SESSION
const endSession = async () => {
  try {
    clearInterval(timerInterval);
    isRunning = false;

    if (!currentSessionId) return;

    await fetch(`${BASE_URL}/end-session/${currentSessionId}`, {
      method: "POST"
    });

    currentSessionId = null;

    alert("Session logged. Check your insights.");

  } catch (err) {
    console.error("Error ending session:", err);
  }
};

// 🔹 Initialize display
updateDisplay();