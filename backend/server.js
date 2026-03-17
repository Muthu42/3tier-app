const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const fs = require("fs");   // NEW

const app = express();

app.use(cors());
app.use(express.json());

// NEW log function
function writeLog(message) {
  const log = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync("/var/log/myapp/app.log", log);
}

const pool = mysql.createPool({
  host: "mysql-db",
  user: "myuser",
  password: "mypassword",
  database: "employee_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get("/", (req, res) => {
  writeLog("Health check endpoint accessed");   // NEW
  res.send("Backend is running");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  writeLog(`Login attempt for email: ${email}`);   // NEW

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  pool.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("SQL Error:", err.message);
      writeLog(`Database error for ${email}: ${err.message}`);   // NEW
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message
      });
    }

    if (result.length > 0) {
      writeLog(`Login success for email: ${email}`);   // NEW
      return res.json({
        success: true,
        message: "Login successful"
      });
    }

    writeLog(`Login failed for email: ${email}`);   // NEW
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
