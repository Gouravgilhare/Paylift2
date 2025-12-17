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

    // EXECUTION ORDER (dependencies matter):

    // 1️⃣ Vehicle Pricing (no dependencies)
    console.log("📍 Seeding vehicle pricing...");
    await seedVehiclePricing();
    // Inserts: bike, auto, mini, prime, suv pricing into vehicle_pricing table

    // 2️⃣ Users (no dependencies)
    console.log("👤 Seeding users...");
    await seedUsers();
    // Inserts: 5 sample users into user_table (userId 1-5)

    // 3️⃣ Admins (no dependencies)
    console.log("🔐 Seeding admins...");
    await seedAdmins();
    // Inserts: superadmin, admin1, admin2 into admin_table

    // 4️⃣ Riders (depends on users)
    console.log("🏍️ Seeding riders...");
    await seedRiders();
    // Links users 1, 3, 5 as riders (riderId 1-3)

    // 5️⃣ Vehicles (depends on riders)
    console.log("🚗 Seeding vehicles...");
    await seedVehicles();
    // Creates 4 vehicles for riders (bike, auto, mini, prime)

    // 6️⃣ Trips (depends on users, riders, vehicles)
    console.log("🛣️ Seeding trips...");
    await seedTrips();
    // Creates 5 sample trips (4 completed, 1 requested)

    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

runSeeds();
