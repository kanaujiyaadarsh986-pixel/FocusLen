const express = require("express");
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const { generateInsights } = require("./analysis");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});
/* =========================
   START SESSION
========================= */
app.post("/start-session", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO sessions (start_time) VALUES (NOW()) RETURNING *"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

/* =========================
   END SESSION
========================= */
app.post("/end-session/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE sessions
       SET end_time = NOW(),
       duration = EXTRACT(EPOCH FROM (NOW() - start_time)) / 60
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    await updateStreak();

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

/* =========================
   GET SESSIONS
========================= */
app.get("/sessions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sessions ORDER BY start_time DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

/* =========================
   GET STREAK
========================= */
app.get("/streak", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM streak LIMIT 1");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

/* =========================
   GET INSIGHTS
========================= */
app.get("/insights", async (req, res) => {
  const insights = await generateInsights();
  res.json(insights);
});

/* =========================
   STREAK LOGIC
========================= */
const updateStreak = async () => {
  try {
    const result = await pool.query("SELECT * FROM streak LIMIT 1");
    const streak = result.rows[0];

    const today = new Date().toISOString().split("T")[0];
    const last = streak.last_study_date;

    if (!last) {
      await pool.query(
        "UPDATE streak SET current_streak = 1, last_study_date = $1",
        [today]
      );
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];

    if (last === today) return;

    if (last === yStr) {
      await pool.query(
        "UPDATE streak SET current_streak = current_streak + 1, last_study_date = $1",
        [today]
      );
    } else {
      await pool.query(
        "UPDATE streak SET current_streak = 1, last_study_date = $1",
        [today]
      );
    }
  } catch (err) {
    console.error(err.message);
  }
};

app.listen(5000, () => {
  console.log("Server running on port 5000");
});