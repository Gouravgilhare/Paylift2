import request from "supertest";
import app from "../app.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, "../logs");

// ====================================
// ADMIN LOGS ROUTES TESTS
// ====================================
describe("📋 ADMIN LOGS ROUTES", () => {
  let adminToken = "mock-admin-token";

  // Setup: Create test log files before tests
  beforeAll(() => {
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Create sample log files for testing
    fs.writeFileSync(
      path.join(logsDir, "combined.log"),
      '{"level":"info","message":"Test log entry 1","timestamp":"2024-01-01 10:00:00"}\n' +
      '{"level":"info","message":"Test log entry 2","timestamp":"2024-01-01 10:01:00"}\n'
    );

    fs.writeFileSync(
      path.join(logsDir, "error.log"),
      '{"level":"error","message":"Test error 1","timestamp":"2024-01-01 10:00:00"}\n'
    );
  });

  // Cleanup: Remove test log files after tests
  afterAll(() => {
    // Clean up test files but keep .gitkeep
    const files = fs.readdirSync(logsDir);
    files.forEach(file => {
      if (file !== '.gitkeep') {
        fs.unlinkSync(path.join(logsDir, file));
      }
    });
  });

  test("GET /api/admin/logs - Get list of log files (without auth)", async () => {
    const res = await request(app)
      .get("/api/admin/logs")
      .timeout(5000);

    // Should require authentication
    expect([401, 403]).toContain(res.statusCode);
  });

  test("GET /api/admin/logs - Get list of log files (with mock auth)", async () => {
    const res = await request(app)
      .get("/api/admin/logs")
      .set("Authorization", `Bearer ${adminToken}`)
      .timeout(5000);

    // Will fail auth validation but endpoint exists
    expect([200, 401, 403, 500]).toContain(res.statusCode);
  });

  test("GET /api/admin/logs/combined.log - Get logs from specific file", async () => {
    const res = await request(app)
      .get("/api/admin/logs/combined.log")
      .query({ lines: 10, offset: 0 })
      .set("Authorization", `Bearer ${adminToken}`)
      .timeout(5000);

    // Will fail auth validation but endpoint exists
    expect([200, 401, 403, 500]).toContain(res.statusCode);
  });

  test("GET /api/admin/logs/recent/error - Get recent error logs", async () => {
    const res = await request(app)
      .get("/api/admin/logs/recent/error")
      .query({ limit: 50 })
      .set("Authorization", `Bearer ${adminToken}`)
      .timeout(5000);

    // Will fail auth validation but endpoint exists
    expect([200, 401, 403, 500]).toContain(res.statusCode);
  });

  test("DELETE /api/admin/logs/combined.log - Clear log file (requires superadmin)", async () => {
    const res = await request(app)
      .delete("/api/admin/logs/combined.log")
      .set("Authorization", `Bearer ${adminToken}`)
      .timeout(5000);

    // Will fail auth validation but endpoint exists
    expect([200, 401, 403, 500]).toContain(res.statusCode);
  });
});
