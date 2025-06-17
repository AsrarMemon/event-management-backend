const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "event_management",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Database connection successful!");
    console.log("Connected to:", process.env.DB_NAME || "event_management");
    await client.end();
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);
    console.log("\nCurrent configuration:");
    console.log("Host:", process.env.DB_HOST || "localhost");
    console.log("Port:", process.env.DB_PORT || "5432");
    console.log("Database:", process.env.DB_NAME || "event_management");
    console.log("User:", process.env.DB_USER || "postgres");
    console.log("Password:", process.env.DB_PASSWORD ? "[SET]" : "[NOT SET]");
  }
}

testConnection();
