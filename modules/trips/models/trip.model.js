import pool from "../../../config/db.config.js";

class TripModel {
  constructor() {
    this.table = "trips";
  }

  // ================= CREATE TRIP =================
  async createTrip(data) {
    const {
      userId,
      vehicle_category,
      start_lat,
      start_lng,
      end_lat,
      end_lng,
      base_fare,
      price_per_km,
      price_per_min,
      payment_method,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO ${this.table}
      (
        userId, vehicle_category,
        start_lat, start_lng, start_point,
        end_lat, end_lng, end_point,
        base_fare, price_per_km, price_per_min,
        payment_method
      )
      VALUES (
        ?, ?, ?, ?, ST_SRID(POINT(?, ?), 4326),
        ?, ?, ST_SRID(POINT(?, ?), 4326),
        ?, ?, ?, ?
      )
      `,
      [
        userId,
        vehicle_category,
        start_lat,
        start_lng,
        start_lng,
        start_lat,
        end_lat,
        end_lng,
        end_lng,
        end_lat,
        base_fare,
        price_per_km,
        price_per_min,
        payment_method,
      ]
    );
    
    return { tripId: result.insertId, ...data };
  }

  // ================= GET TRIP DETAILS =================
  async getTripById(tripId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE tripId = ?`,
      [tripId]
    );

    return rows[0] || null;
  }

  // ================= UPDATE TRIP FIELDS =================
  async updateTrip(tripId, updates) {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });

    values.push(tripId);

    const [result] = await pool.query(
      `UPDATE ${this.table} SET ${fields.join(", ")}, updated_at = NOW() WHERE tripId = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  // ================= SET RIDER TO TRIP =================
  async assignRider(tripId, riderId, vehicleId) {
    const [result] = await pool.query(
      `
      UPDATE ${this.table}
      SET riderId = ?, vehicleId = ?, status = 'accepted'
      WHERE tripId = ?
      `,
      [riderId, vehicleId, tripId]
    );

    return result.affectedRows > 0;
  }

  // ================= LIST OF USER TRIPS =================
  async getUserTrips(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE userId = ? ORDER BY tripId DESC`,
      [userId]
    );
    return rows;
  }

  // ================= LIST OF RIDER TRIPS =================
  async getRiderTrips(riderId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE riderId = ? ORDER BY tripId DESC`,
      [riderId]
    );
    return rows;
  }
}

export const tripModel = new TripModel();
