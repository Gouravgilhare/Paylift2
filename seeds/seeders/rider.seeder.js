import pool from "../../config/db.config.js";

const seedRiders = async () => {
  const ridersData = [
    {
      userId: 1,
      driving_license: "DL-KA-2020-0001",
      is_active: 1,
    },
    {
      userId: 3,
      driving_license: "DL-MH-2019-0002",
      is_active: 1,
    },
    {
      userId: 5,
      driving_license: "DL-GJ-2021-0003",
      is_active: 1,
    },
  ];

  try {
    for (const rider of ridersData) {
      const query =
        "INSERT INTO rider_table (userId, driving_license, is_active) VALUES (?, ?, ?)";
      const values = [rider.userId, rider.driving_license, rider.is_active];
      await pool.promise().query(query, values);
    }
    console.log("   ✓ Riders seeded");
  } catch (error) {
    console.error("   ✗ Error seeding riders:", error.message);
    throw error;
  }
};

export default seedRiders;
