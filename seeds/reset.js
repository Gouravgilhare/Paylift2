import db from "../config/db.config.js";

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

    for (const table of tables) {
      try {
        await db.promise().query(`DROP TABLE IF EXISTS ${table}`);
        console.log(`   ✓ Dropped ${table}`);
      } catch (error) {
        console.warn(`   ⚠ Could not drop ${table}: ${error.message}`);
      }
    }

    console.log("\n✅ Database reset completed!");
    console.log("⚠️ Please run: npm run seed (to recreate tables and seed data)\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset failed:", error.message);
    process.exit(1);
  }
};

resetDatabase();
