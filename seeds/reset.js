import pool from "../config/db.config.js";

const resetDatabase = async () => {
  try {
    console.log("🔄 Dropping all tables...\n");

    const tables = [
      "trip_audit_log",
      "trips",
      "location_history",
      "live_locations_log",
      "live_locations",
      "admin_activity_log",
      "vehicle_audit_log",
      "rider_audit_log",
      "user_audit_log",
      "admin_table",
      "vehicle_table",
      "rider_table",
      "user_table",
      "vehicle_pricing",
    ];

    // Drop tables in reverse dependency order
    for (const table of tables) {
      try {
        await pool.promise().query(`DROP TABLE IF EXISTS ${table}`);
        console.log(`   ✓ Dropped ${table}`);
      } catch (error) {
        console.warn(`   ⚠ Could not drop ${table}`);
      }
    }

    console.log("\n✅ Database reset completed!");
    console.log("⚠️ Run: npm run seed (to recreate tables)\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset failed:", error.message);
    process.exit(1);
  }
};

resetDatabase();
