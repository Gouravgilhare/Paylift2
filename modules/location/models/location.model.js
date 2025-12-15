import pool from "../../../config/db.config.js";

class LocationModel {
  constructor() {
    this.liveTable = "live_locations";
    this.logTable = "live_locations_log";
    this.historyTable = "location_history";
  }

  // === LIVE LOCATION ===

  async upsertLiveLocation(entity_id, entity_type, latitude, longitude) {
    const [result] = await pool.query(
      `
    INSERT INTO ${this.liveTable}
    (entity_id, entity_type, latitude, longitude)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      latitude = VALUES(latitude),
      longitude = VALUES(longitude),
      updated_at = CURRENT_TIMESTAMP
    `,
      [entity_id, entity_type, latitude, longitude]
    );
    return result;
  }

  async getLiveLocation(entity_id, entity_type) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.liveTable} WHERE entity_id = ? AND entity_type = ?`,
      [entity_id, entity_type]
    );
    return rows[0] || null;
  }

  // === LOGGING ===
  async logLocationChange(
    entity_id,
    entity_type,
    old_lat,
    old_long,
    new_lat,
    new_long
  ) {
    await pool.query(
      `
      INSERT INTO ${this.logTable}
      (entity_id, entity_type, old_latitude, old_longitude, new_latitude, new_longitude)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [entity_id, entity_type, old_lat, old_long, new_lat, new_long]
    );
  }

  // === TRIP HISTORY ===

  async insertTripHistory(data) {
    const { trip_id, rider_id, latitude, longitude, distance_meters } = data;

    const [result] = await pool.query(
      `
      INSERT INTO ${this.historyTable}
      (trip_id, rider_id, latitude, longitude, distance_meters)
      VALUES (?, ?, ?, ?, ?)
      `,
      [trip_id, rider_id, latitude, longitude, distance_meters]
    );

    return { id: result.insertId, ...data };
  }

  async getTripHistory(trip_id) {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.historyTable} WHERE trip_id = ? ORDER BY id ASC`,
      [trip_id]
    );
    return rows;
  }
}

export const locationModel = new LocationModel();
