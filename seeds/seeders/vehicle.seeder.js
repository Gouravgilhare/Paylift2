import pool from "../../config/db.config.js";

const seedVehicles = async () => {
  const vehiclesData = [
    {
      riderId: 1,
      category: "bike",
      vehicle_type: "two-wheeler",
      vehicle_number: "KA01AA0001",
      rc_number: "RC-KA-001",
      owner_name: "Rajesh Kumar",
      owner_contact: "9876543210",
      driving_license: "DL-KA-2020-0001",
    },
    {
      riderId: 1,
      category: "auto",
      vehicle_type: "auto-rickshaw",
      vehicle_number: "KA02BB0002",
      rc_number: "RC-KA-002",
      owner_name: "Rajesh Kumar",
      owner_contact: "9876543210",
      driving_license: "DL-KA-2020-0001",
    },
    {
      riderId: 2,
      category: "mini",
      vehicle_type: "hatchback",
      vehicle_number: "MH03CC0003",
      rc_number: "RC-MH-003",
      owner_name: "Arjun Patel",
      owner_contact: "9876543212",
      driving_license: "DL-MH-2019-0002",
    },
    {
      riderId: 3,
      category: "prime",
      vehicle_type: "sedan",
      vehicle_number: "GJ04DD0004",
      rc_number: "RC-GJ-004",
      owner_name: "Vikram Desai",
      owner_contact: "9876543214",
      driving_license: "DL-GJ-2021-0003",
    },
  ];

  try {
    for (const vehicle of vehiclesData) {
      const query =
        "INSERT INTO vehicle_table (riderId, category, vehicle_type, vehicle_number, rc_number, owner_name, owner_contact, driving_license, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        vehicle.riderId,
        vehicle.category,
        vehicle.vehicle_type,
        vehicle.vehicle_number,
        vehicle.rc_number,
        vehicle.owner_name,
        vehicle.owner_contact,
        vehicle.driving_license,
        1,
      ];
      await pool.promise().query(query, values);
    }
    console.log("   ✓ Vehicles seeded");
  } catch (error) {
    console.error("   ✗ Error seeding vehicles:", error.message);
    throw error;
  }
};

export default seedVehicles;
