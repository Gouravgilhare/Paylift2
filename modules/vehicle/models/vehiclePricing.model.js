// modules/vehicle/models/vehiclePricing.model.js

import pool from "../../../config/db.config.js";

/**
 * Vehicle Pricing Model
 * Handles database queries for vehicle pricing
 */

/* ========== CRUD Operations ========== */

/**
 * Create new vehicle pricing
 * @param {Object} data - Pricing data
 * @returns {Object} Result of insert operation
 */
export const createVehiclePricing = async (data) => {
  const {
    category,
    base_fare,
    per_km,
    per_minute,
    min_fare,
    cancellation_fee,
  } = data;

  const query = `
    INSERT INTO vehicle_pricing (category, base_fare, per_km, per_minute, min_fare, cancellation_fee)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [
    category,
    base_fare ,
    per_km ,
    per_minute ,
    min_fare ,
    cancellation_fee ,
  ]);

  return result;
};

/**
 * Get vehicle pricing by ID
 * @param {number} id - Pricing ID
 * @returns {Object|null} Pricing record or null
 */
export const getVehiclePricingById = async (id) => {
  const query = `SELECT * FROM vehicle_pricing WHERE id = ?`;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

/**
 * Get vehicle pricing by category
 * @param {string} category - Vehicle category ('two_wheeler' or 'four_wheeler')
 * @returns {Object|null} Pricing record or null
 */
export const getVehiclePricingByCategory = async (category) => {
  const query = `SELECT * FROM vehicle_pricing WHERE category = ?`;
  const [rows] = await pool.execute(query, [category]);
  return rows[0] || null;
};

/**
 * Get all vehicle pricing records
 * @returns {Array} All pricing records
 */
export const getAllVehiclePricing = async () => {
  const query = `
    SELECT id, category, base_fare, per_km, per_minute, min_fare, cancellation_fee, created_at, updated_at
    FROM vehicle_pricing
    ORDER BY created_at DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

/**
 * Update vehicle pricing by ID (supports partial updates)
 * @param {number} id - Pricing ID
 * @param {Object} data - Data to update
 * @returns {Object} Result of update operation
 */
export const updateVehiclePricingById = async (id, data) => {
  const fields = [];
  const values = [];

  const allowedFields = [
    "category",
    "base_fare",
    "per_km",
    "per_minute",
    "min_fare",
    "cancellation_fee",
  ];

  for (const key in data) {
    if (allowedFields.includes(key) && data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return null; // Nothing to update

  fields.push("updated_at = CURRENT_TIMESTAMP");

  const query = `UPDATE vehicle_pricing SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  const [result] = await pool.execute(query, values);
  return result;
};

/**
 * Update vehicle pricing by category (supports partial updates)
 * @param {string} category - Vehicle category
 * @param {Object} data - Data to update
 * @returns {Object} Result of update operation
 */
export const updateVehiclePricingByCategory = async (category, data) => {
  const fields = [];
  const values = [];

  const allowedFields = [
    "base_fare",
    "per_km",
    "per_minute",
    "min_fare",
    "cancellation_fee",
  ];

  for (const key in data) {
    if (allowedFields.includes(key) && data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return null; // Nothing to update

  fields.push("updated_at = CURRENT_TIMESTAMP");

  const query = `UPDATE vehicle_pricing SET ${fields.join(
    ", ",
  )} WHERE category = ?`;
  values.push(category);

  const [result] = await pool.execute(query, values);
  return result;
};

/**
 * Update all pricing fields for a specific category
 * @param {string} category - Vehicle category
 * @param {Object} data - Complete pricing data
 * @returns {Object} Result of update operation
 */
export const updateVehiclePricingComplete = async (category, data) => {
  const { base_fare, per_km, per_minute, min_fare, cancellation_fee } = data;

  const query = `
    UPDATE vehicle_pricing
    SET base_fare = ?, per_km = ?, per_minute = ?, min_fare = ?, cancellation_fee = ?, updated_at = CURRENT_TIMESTAMP
    WHERE category = ?
  `;

  const [result] = await pool.execute(query, [
    base_fare,
    per_km,
    per_minute,
    min_fare,
    cancellation_fee,
    category,
  ]);

  return result;
};

/**
 * Delete vehicle pricing by ID
 * @param {number} id - Pricing ID
 * @returns {Object} Result of delete operation
 */
export const deleteVehiclePricing = async (id) => {
  const query = `DELETE FROM vehicle_pricing WHERE id = ?`;
  const [result] = await pool.execute(query, [id]);
  return result;
};

/**
 * Check if pricing exists for category
 * @param {string} category - Vehicle category
 * @returns {boolean} True if exists, false otherwise
 */
export const vehiclePricingExists = async (category) => {
  const query = `SELECT COUNT(*) AS count FROM vehicle_pricing WHERE category = ?`;
  const [[row]] = await pool.execute(query, [category]);
  return row.count > 0;
};

/**
 * Get pricing statistics
 * @returns {Object} Statistics about pricing records
 */
export const getPricingStats = async () => {
  const query = `
    SELECT 
      COUNT(*) AS totalRecords,
      MIN(base_fare) AS minBaseFare,
      MAX(base_fare) AS maxBaseFare,
      AVG(base_fare) AS avgBaseFare
    FROM vehicle_pricing
  `;
  const [[row]] = await pool.execute(query);
  return row;
};
