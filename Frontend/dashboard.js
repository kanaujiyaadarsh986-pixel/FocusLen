const BASE_URL = "http://localhost:5000";

let chart; // store chart instance

const loadDashboard = async () => {
  try {
    // 🔹 Fetch sessions
    const res = await fetch(`${BASE_URL}/sessions`);
    const sessions = await res.json();

    // 🔹 Total Time
    let totalTime = 0;
    sessions.forEach(s => totalTime += s.duration || 0);

    document.getElementById("totalTime").textContent =
      "Total Time: " + Math.round(totalTime) + " min";

    document.getElementById("sessionCount").textContent =
      "Sessions: " + sessions.length;

    // 🔹 Streak
    const streakRes = await fetch(`${BASE_URL}/streak`);
    const streak = await streakRes.json();

    let message = "";

    if (streak.current_streak === 0) {
      message = "Start your journey.";
    } else if (streak.current_streak < 3) {
      message = "Build consistency.";
    } else if (streak.current_streak < 7) {
      message = "Good streak.";
    } else {
      message = "Strong discipline.";
    }

    document.getElementById("streak").textContent =
      `Streak: ${streak.current_streak} | ${message}`;

    // 🔹 Insights
    const insRes = await fetch(`${BASE_URL}/insights`);
    const insights = await insRes.json();

    const list = document.getElementById("insightsList");
    list.innerHTML = "";

    insights.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      list.appendChild(li);
    });

    // 🔹 Chart Data
    const labels = sessions.map((s, i) => `S${i + 1}`);
    const data = sessions.map(s => Math.round(s.duration || 0));

    const ctx = document.getElementById("studyChart").getContext("2d");

    // destroy old chart before creating new
    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Minutes Studied",
          data: data
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  } catch (err) {
    console.error(err);
  }
};

// initial load
loadDashboard();

// auto refresh every 3 sec
setInterval(loadDashboard, 3000);


new Chart(ctx, {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false, // 👈 MUST be false
  }
});