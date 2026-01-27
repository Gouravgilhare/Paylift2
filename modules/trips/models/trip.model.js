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
      payment_method,
      gender_preference,
    } = data;

    // Fetch pricing from vehicle_pricing table based on category
    const [pricingRows] = await pool.query(
      `SELECT base_fare, per_km, per_minute FROM vehicle_pricing WHERE category = ?`,
      [vehicle_category],
    );

    if (!pricingRows[0]) {
      throw new Error(`Pricing not found for category: ${vehicle_category}`);
    }

    const {
      base_fare,
      per_km: price_per_km,
      per_minute: price_per_min,
    } = pricingRows[0];

    const [result] = await pool.query(
      `
      INSERT INTO ${this.table}
      (
        userId, vehicle_category,
        start_lat, start_lng, start_point,
        end_lat, end_lng, end_point,
        base_fare, price_per_km, price_per_min,
        payment_method, gender_preference
      )
      VALUES (
        ?, ?, ?, ?, ST_SRID(POINT(?, ?), 4326),
        ?, ?, ST_SRID(POINT(?, ?), 4326),
        ?, ?, ?, ?, ?
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
        gender_preference,
      ],
    );

    return { tripId: result.insertId, ...data };
  }

  // ================= GET TRIP DETAILS =================
  async getTripById(tripId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE tripId = ?`,
      [tripId],
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
      values,
    );

    return result.affectedRows > 0;
  }

  // ================= VERIFY GENDER COMPATIBILITY =================
  async verifyGenderCompatibility(tripId, riderId) {
    const [tripRows] = await pool.query(
      `SELECT t.gender_preference, u.gender FROM ${this.table} t 
       JOIN user_table u ON t.userId = u.userId 
       WHERE t.tripId = ?`,
      [tripId],
    );

    const [riderRows] = await pool.query(
      `SELECT gender FROM user_table WHERE userId = ?`,
      [riderId],
    );

    if (!tripRows[0] || !riderRows[0]) return false;

    const { gender_preference: userGenderPref } = tripRows[0];
    const { gender: riderGender } = riderRows[0];

    // If no preference set, allow any gender
    if (!userGenderPref) return true;

    // Match rider gender with user's preference
    return userGenderPref === riderGender;
  }

  // ================= SET RIDER TO TRIP =================
  async assignRider(tripId, riderId, vehicleId) {
    // Get trip details with user gender preference
    const [tripRows] = await pool.query(
      `SELECT t.gender_preference, u.gender FROM ${this.table} t 
       JOIN user_table u ON t.userId = u.userId 
       WHERE t.tripId = ?`,
      [tripId],
    );

    if (!tripRows[0]) {
      return { success: false, message: "Trip not found" };
    }

    // Get rider gender
    const [riderRows] = await pool.query(
      `SELECT gender FROM user_table WHERE userId = ?`,
      [riderId],
    );

    if (!riderRows[0]) {
      return { success: false, message: "Rider not found" };
    }

    const { gender_preference: userGenderPref } = tripRows[0];
    const { gender: riderGender } = riderRows[0];

    // Verify gender preference match
    if (userGenderPref && userGenderPref !== riderGender) {
      return {
        success: false,
        message: `Gender mismatch: User prefers ${userGenderPref} rider, but assigned rider is ${riderGender}`,
      };
    }

    // Assign rider to trip
    const [result] = await pool.query(
      `
      UPDATE ${this.table}
      SET riderId = ?, vehicleId = ?, status = 'accepted'
      WHERE tripId = ?
      `,
      [riderId, vehicleId, tripId],
    );

    if (result.affectedRows > 0) {
      return { success: true, message: "Rider assigned successfully" };
    }

    return { success: false, message: "Failed to assign rider" };
  }

  // ================= LIST OF USER TRIPS =================
  async getUserTrips(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE userId = ? ORDER BY tripId DESC`,
      [userId],
    );
    return rows;
  }

  // ================= LIST OF RIDER TRIPS =================
  async getRiderTrips(riderId) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.table} WHERE riderId = ? ORDER BY tripId DESC`,
      [riderId],
    );
    return rows;
  }
}

export const tripModel = new TripModel();
