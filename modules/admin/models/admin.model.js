// modules/admin/models/admin.model.js

import pool from "../../../config/db.config.js";

/**
 * Admin Model
 * Handles database queries for admin users
 */

/* ------------------ CRUD ------------------ */

// Create new admin
export const createAdmin = async ({
  firstname,
  lastname,
  email,
  password,
  role,
}) => {
  const query = `
    INSERT INTO admin_table (firstname, lastname, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    firstname,
    lastname,
    email,
    password,
    role,
  ]);
  return result;
};

// Get admin by email
export const getAdminByEmail = async (email) => {
  const query = `SELECT * FROM admin_table WHERE email = ?`;
  const [rows] = await pool.execute(query, [email]);
  return rows[0] || null;
};

// Get admin by ID
export const getAdminById = async (adminId) => {
  const query = `SELECT * FROM admin_table WHERE admin_id = ?`;
  const [rows] = await pool.execute(query, [adminId]);
  return rows[0] || null;
};

// Get all admins
export const getAllAdmins = async () => {
  const query = `
    SELECT admin_id, firstname, lastname, email, role, is_active, created_at, updated_at
    FROM admin_table
    ORDER BY created_at DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// Update admin details (supports partial updates)
export const updateAdmin = async (adminId, data) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return null; // nothing to update

  const query = `UPDATE admin_table SET ${fields.join(
    ", "
  )} WHERE admin_id = ?`;
  values.push(adminId);

  const [result] = await pool.execute(query, values);
  return result;
};

// Delete admin
export const deleteAdmin = async (adminId) => {
  const query = `DELETE FROM admin_table WHERE admin_id = ?`;
  const [result] = await pool.execute(query, [adminId]);
  return result;
};

/* ------------------ Dashboard Helpers ------------------ */

// Count total admins (for analytics)
export const countAdmins = async () => {
  const query = `SELECT COUNT(*) AS totalAdmins FROM admin_table`;
  const [[row]] = await pool.execute(query);
  return row.totalAdmins;
};

export const countUsers = async () => {
  const query = `SELECT COUNT(*) AS total FROM user_table`;
  const [[row]] = await pool.execute(query);
  return row.total;
};

export const countRiders = async () => {
  const query = `SELECT COUNT(*) AS total FROM rider_table`;
  const [[row]] = await pool.execute(query);
  return row.total;
};

export const countVehicles = async () => {
  const query = `SELECT COUNT(*) AS total FROM vehicle_table`;
  const [[row]] = await pool.execute(query);
  return row.total;
};

export const countTrips = async () => {
  const query = `SELECT COUNT(*) AS total FROM trips`;
  const [[row]] = await pool.execute(query);
  return row.total;
};

export const sumRevenue = async () => {
  try {
    const query = `SELECT SUM(trip_fare) AS total FROM trips WHERE trip_fare IS NOT NULL`;
    const [[row]] = await pool.execute(query);
    return row.total || 0;
  } catch (error) {
    // Column doesn't exist, try alternative names
    try {
      const query = `SELECT SUM(amount) AS total FROM trips WHERE amount IS NOT NULL`;
      const [[row]] = await pool.execute(query);
      return row.total || 0;
    } catch {
      // If both fail, return 0
      console.warn("Revenue column not found in trips table");
      return 0;
    }
  }
};

export const getAllUsers = async () => {
  const query = `SELECT * FROM user_table ORDER BY created_at DESC`;
  const [rows] = await pool.execute(query);
  return rows;
};

export const getAllRiders = async () => {
  const query = `
    SELECT r.*, u.firstname, u.lastname, u.mobile_number, u.email 
    FROM rider_table r
    JOIN user_table u ON r.userId = u.userId
    ORDER BY r.created_at DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export const getAllVehicles = async () => {
  const query = `
    SELECT v.*, u.firstname, u.lastname, u.mobile_number
    FROM vehicle_table v
    JOIN rider_table r ON v.riderId = r.riderId
    JOIN user_table u ON r.userId = u.userId
    ORDER BY v.created_at DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export const getAllTrips = async () => {
  const query = `
    SELECT t.*, 
           u.firstname AS user_firstname, 
           u.lastname AS user_lastname,
           rd.firstname AS rider_firstname, 
           rd.lastname AS rider_lastname
    FROM trips t
    JOIN user_table u ON t.userId = u.userId
    JOIN rider_table r ON t.riderId = r.riderId
    JOIN user_table rd ON r.userId = rd.userId
    ORDER BY t.created_at DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};
