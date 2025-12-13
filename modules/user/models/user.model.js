// modules/user/user.model.js
import pool from "../../../config/db.config.js";

class UserModel {
  constructor() {
    this.table = "user_table";
  }

  // Get all users
  async getAllUsers() {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} ORDER BY userId DESC`
    );
    return rows;
  }

  // Get user by ID
  async getUserById(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE userId = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  // Create user
  async createUser({
    firstname,
    lastname,
    gender,
    dob,
    aadhar,
    mobile_number,
    email,
    image_add,
    security_pin,
    status = "active",
  }) {
    const [result] = await pool.query(
      `INSERT INTO ${this.table} 
      (firstname, lastname, gender, dob, aadhar, mobile_number, email, image_add, security_pin, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstname,
        lastname,
        gender,
        dob,
        aadhar,
        mobile_number,
        email,
        image_add,
        security_pin,
        status,
      ]
    );

    return {
      userId: result.insertId,
      firstname,
      lastname,
      gender,
      dob,
      aadhar,
      mobile_number,
      email,
      image_add,
      status,
    };
  }

  // Update user
  async updateUser(
    userId,
    {
      firstname,
      lastname,
      gender,
      dob,
      aadhar,
      mobile_number,
      email,
      image_add,
      security_pin,
      status,
    }
  ) {
    const [result] = await pool.query(
      `UPDATE ${this.table} 
      SET firstname = ?, lastname = ?, gender = ?, dob = ?, aadhar = ?, mobile_number = ?, email = ?, image_add = ?, security_pin = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE userId = ?`,
      [
        firstname,
        lastname,
        gender,
        dob,
        aadhar,
        mobile_number,
        email,
        image_add,
        security_pin,
        status,
        userId,
      ]
    );
    return result.affectedRows > 0;
  }

  // Delete user
  async deleteUser(userId) {
    const [result] = await pool.query(
      `DELETE FROM ${this.table} WHERE userId = ?`,
      [userId]
    );
    return result.affectedRows > 0;
  }
}

export const userModel = new UserModel();
