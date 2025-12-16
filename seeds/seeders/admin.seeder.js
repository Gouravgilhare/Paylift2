import db from "../../config/db.config.js";

const seedAdmins = async () => {
  const adminsData = [
    {
      firstname: "Super",
      lastname: "Admin",
      email: "superadmin@paylift.com",
      role: "superadmin",
      is_active: 1,
    },
    {
      firstname: "Admin",
      lastname: "One",
      email: "admin1@paylift.com",
      role: "admin",
      is_active: 1,
    },
    {
      firstname: "Admin",
      lastname: "Two",
      email: "admin2@paylift.com",
      role: "admin",
      is_active: 1,
    },
  ];

  try {
    for (const admin of adminsData) {
      const query =
        "INSERT INTO admin_table (firstname, lastname, email, role, is_active) VALUES (?, ?, ?, ?, ?)";
      const values = [
        admin.firstname,
        admin.lastname,
        admin.email,
        admin.role,
        admin.is_active,
      ];
      await db.promise().query(query, values);
    }
    console.log("   ✓ Admins seeded");
  } catch (error) {
    console.error("   ✗ Error seeding admins:", error.message);
    throw error;
  }
};

export default seedAdmins;
