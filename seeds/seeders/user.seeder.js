import db from "../../config/db.config.js";
import { v4 as uuidv4 } from "uuid";

const seedUsers = async () => {
  const usersData = [
    {
      firstname: "Rajesh",
      lastname: "Kumar",
      gender: "Male",
      dob: "1990-05-15",
      aadhar: "123456789012",
      mobile_number: "9876543210",
      email: "rajesh.kumar@example.com",
    },
    {
      firstname: "Priya",
      lastname: "Singh",
      gender: "Female",
      dob: "1992-08-22",
      aadhar: "234567890123",
      mobile_number: "9876543211",
      email: "priya.singh@example.com",
    },
    {
      firstname: "Arjun",
      lastname: "Patel",
      gender: "Male",
      dob: "1988-03-10",
      aadhar: "345678901234",
      mobile_number: "9876543212",
      email: "arjun.patel@example.com",
    },
    {
      firstname: "Neha",
      lastname: "Sharma",
      gender: "Female",
      dob: "1995-11-30",
      aadhar: "456789012345",
      mobile_number: "9876543213",
      email: "neha.sharma@example.com",
    },
    {
      firstname: "Vikram",
      lastname: "Desai",
      gender: "Male",
      dob: "1987-07-18",
      aadhar: "567890123456",
      mobile_number: "9876543214",
      email: "vikram.desai@example.com",
    },
  ];

  try {
    for (const user of usersData) {
      const query =
        "INSERT INTO user_table (firstname, lastname, gender, dob, aadhar, mobile_number, email, security_pin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        user.firstname,
        user.lastname,
        user.gender,
        user.dob,
        user.aadhar,
        user.mobile_number,
        user.email,
        "1234", // sample security pin
      ];
      await db.promise().query(query, values);
    }
    console.log("   ✓ Users seeded");
  } catch (error) {
    console.error("   ✗ Error seeding users:", error.message);
    throw error;
  }
};

export default seedUsers;
