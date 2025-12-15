import jwt from "jsonwebtoken";
import redis from "../../../config/redisClient.js";
import db from "../../../config/db.config.js";
import "../../../config/env.config.js";

/* ========================================================================== */
/*                               OTP HELPERS                                  */
/* ========================================================================== */

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const saveOtp = async (key, otp) => {
  // 5 minutes expiry
  await redis.set(`otp:${key}`, otp, "EX", 300);
};

export const verifyStoredOtp = async (key) => {
  return await redis.get(`otp:${key}`);
};

export const deleteOtp = async (key) => {
  await redis.del(`otp:${key}`);
};

/* ========================================================================== */
/*                               JWT HELPERS                                  */
/* ========================================================================== */

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

/* ========================================================================== */
/*                            REFRESH TOKEN STORE                             */
/* ========================================================================== */

export const storeRefreshToken = async (key, token) => {
  await redis.set(`refresh:${key}`, token, "EX", 30 * 24 * 60 * 60);
};

export const getStoredRefreshToken = async (key) => {
  return await redis.get(`refresh:${key}`);
};

export const deleteRefreshToken = async (key) => {
  await redis.del(`refresh:${key}`);
};

/* ========================================================================== */
/*                               USER SERVICES                                */
/* ========================================================================== */

export const createOrGetUser = async (mobile) => {
  const [rows] = await db.query(
    "SELECT * FROM user_table WHERE mobile_number = ?",
    [mobile]
  );

  if (rows.length) return rows[0];

  const [result] = await db.query(
    "INSERT INTO user_table (mobile_number, firstname, lastname) VALUES (?, ?, ?)",
    [mobile, "Unknown", "Unknown"]
  );

  const [user] = await db.query("SELECT * FROM user_table WHERE userId = ?", [
    result.insertId,
  ]);

  return user[0];
};

/* ========================================================================== */
/*                               ADMIN SERVICES                               */
/* ========================================================================== */

export const getAdminByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM admin_table WHERE email = ?", [
    email,
  ]);

  return rows.length ? rows[0] : null;
};
