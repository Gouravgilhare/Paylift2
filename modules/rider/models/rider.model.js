import pool from "../../../config/db.config.js";

class RiderModel {
  constructor() {
    this.table = "rider_table";
  }

  // Get all riders
  async getAllRiders() {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} ORDER BY riderId DESC`
    );
    return rows;
  }

  // Get rider by ID
  async getRiderById(riderId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE riderId = ?`,
      [riderId]
    );
    return rows[0] || null;
  }

  // Get rider by UserId
  async getRiderByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE userId = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  // Create rider
  async createRider({ userId, driving_license, dl_image }) {
    const [result] = await pool.query(
      `INSERT INTO ${this.table} 
      (userId, driving_license, dl_image)
      VALUES (?, ?, ?)`,
      [userId, driving_license, dl_image]
    );

    return {
      riderId: result.insertId,
      userId,
      driving_license,
      dl_image,
    };
  }

  // Update rider
  async updateRider(riderId, { driving_license, dl_image, is_active }) {
    const [result] = await pool.query(
      `UPDATE ${this.table}
      SET driving_license = ?, dl_image = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE riderId = ?`,
      [driving_license, dl_image, is_active, riderId]
    );

    return result.affectedRows > 0;
  }

  // Delete rider
  async deleteRider(riderId) {
    const [result] = await pool.query(
      `DELETE FROM ${this.table} WHERE riderId = ?`,
      [riderId]
    );
    return result.affectedRows > 0;
  }
}

export const riderModel = new RiderModel();
