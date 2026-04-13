const pool = require("./db");

const generateInsights = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM sessions WHERE duration IS NOT NULL ORDER BY start_time"
    );

    const sessions = result.rows;

    if (sessions.length === 0) {
      return ["No data yet. Start studying to get insights."];
    }

    let insights = [];

    // 🔹 1. Focus Analysis
    let total = 0;
    sessions.forEach(s => total += s.duration);
    const avg = total / sessions.length;

    if (avg < 25) {
      insights.push("Your focus sessions are short. Try 25–30 min sessions.");
    } else if (avg <= 60) {
      insights.push("You have a good focus range. Keep it consistent.");
    } else {
      insights.push("Long sessions detected. Watch out for burnout.");
    }

    // 🔹 2. Break Analysis
    let longBreaks = 0;

    for (let i = 1; i < sessions.length; i++) {
      const prev = new Date(sessions[i - 1].end_time);
      const curr = new Date(sessions[i].start_time);

      const gap = (curr - prev) / (1000 * 60);

      if (gap > 30) longBreaks++;
    }

    if (longBreaks > sessions.length / 2) {
      insights.push("You take long breaks. This may reduce consistency.");
    } else {
      insights.push("Your break pattern looks balanced.");
    }

    // 🔹 3. Time Analysis
    let night = 0;

    sessions.forEach(s => {
      const hour = new Date(s.start_time).getHours();
      if (hour >= 20) night++;
    });

    if (night > sessions.length / 2) {
      insights.push("You are more productive at night.");
    } else {
      insights.push("You study mostly during the day.");
    }

    return insights.slice(0, 3);

  } catch (err) {
    console.error(err.message);
    return ["Error generating insights"];
  }
};

module.exports = { generateInsights };