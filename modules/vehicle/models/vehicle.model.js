import pool from "../../../config/db.config.js";

class VehicleModel {
  constructor() {
    this.table = "vehicle_table";
  }

  // Create Vehicle
  async createVehicle(data) {
    const {
      riderId,
      category,
      vehicle_name,
      vehicle_type,
      vehicle_number,
      rc_number,
      owner_name,
      owner_contact,
      driving_license,
      vehicle_image,
      rc_image,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO ${this.table}
      (riderId, category, vehicle_name, vehicle_type, vehicle_number, rc_number, 
       owner_name, owner_contact, driving_license, vehicle_image, rc_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        riderId,
        category,
        vehicle_name,
        vehicle_type,
        vehicle_number,
        rc_number,
        owner_name,
        owner_contact,
        driving_license,
        vehicle_image,
        rc_image,
      ]
    );

    return { vehicleId: result.insertId, ...data };
  }

  // Get vehicle by ID
  async getVehicleById(vehicleId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE vehicleId = ?`,
      [vehicleId]
    );
    return rows[0] || null;
  }

  // Get vehicles for a rider
  async getVehiclesByRider(riderId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE riderId = ? ORDER BY vehicleId DESC`,
      [riderId]
    );
    return rows;
  }

  // Update vehicle
  async updateVehicle(vehicleId, data) {
    const {
      category,
      vehicle_name,
      vehicle_type,
      vehicle_number,
      rc_number,
      owner_name,
      owner_contact,
      driving_license,
      vehicle_image,
      rc_image,
      is_active,
    } = data;

    const [result] = await pool.query(
      `UPDATE ${this.table}
       SET category=?, vehicle_name=?, vehicle_type=?, vehicle_number=?, rc_number=?,
           owner_name=?, owner_contact=?, driving_license=?, 
           vehicle_image=?, rc_image=?, is_active=?, 
           updated_at = CURRENT_TIMESTAMP
       WHERE vehicleId=?`,
      [
        category,
        vehicle_name,
        vehicle_type,
        vehicle_number,
        rc_number,
        owner_name,
        owner_contact,
        driving_license,
        vehicle_image,
        rc_image,
        is_active,
        vehicleId,
      ]
    );

    return result.affectedRows > 0;
  }

  // Delete vehicle
  async deleteVehicle(vehicleId) {
    const [result] = await pool.query(
      `DELETE FROM ${this.table} WHERE vehicleId=?`,
      [vehicleId]
    );

    return result.affectedRows > 0;
  }
}

export const vehicleModel = new VehicleModel();
