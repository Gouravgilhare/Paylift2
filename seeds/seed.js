import pool from "../config/db.config.js";
import seedUsers from "./seeders/user.seeder.js";
import seedRiders from "./seeders/rider.seeder.js";
import seedVehicles from "./seeders/vehicle.seeder.js";
import seedVehiclePricing from "./seeders/vehiclePricing.seeder.js";
import seedTrips from "./seeders/trip.seeder.js";
import seedAdmins from "./seeders/admin.seeder.js";

const runSeeds = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // 1. Seed vehicle pricing first (no dependencies)
    console.log("📍 Seeding vehicle pricing...");
    await seedVehiclePricing();

    // 2. Seed users
    console.log("👤 Seeding users...");
    await seedUsers();

    // 3. Seed admins
    console.log("🔐 Seeding admins...");
    await seedAdmins();

    // 4. Seed riders (depends on users)
    console.log("🏍️ Seeding riders...");
    await seedRiders();

    // 5. Seed vehicles (depends on riders)
    console.log("🚗 Seeding vehicles...");
    await seedVehicles();

    // 6. Seed trips (depends on users, riders, vehicles)
    console.log("🛣️ Seeding trips...");
    await seedTrips();

    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

runSeeds();
