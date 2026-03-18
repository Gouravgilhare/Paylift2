import mysql from "mysql2/promise";
import "./env.config.js";

// Create MySQL pool instance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20, // Increased for production usage
  queueLimit: 0,
  ssl:{
    ca: fs.readFilesSync("server-ca.pem"), 
    cert: fs.readFilesSync("client-cert.pem"), 
    key: fs.readFilesSync("client-key.pem"), 
  }
});

// Immediately test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

export default pool;
