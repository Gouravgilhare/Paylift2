import jwt from "jsonwebtoken";
import redis from "../../../config/redisClient.js";
import db from "../../../config/db.config.js";
import "../../../config/env.config.js";

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const saveOtp = async (mobile, otp) => {
  await redis.set(`otp:${mobile}`, otp, "EX", 1000); // 5 min
};

export const verifyStoredOtp = async (mobile) => {
  return await redis.get(`otp:${mobile}`);
};

export const deleteOtp = async (mobile) => {
  await redis.del(`otp:${mobile}`);
};

export const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN || "30d",
  });

export const storeRefreshToken = async (mobile, token) => {
  await redis.set(`refresh:${mobile}`, token, "EX", 30 * 24 * 3600);
};

export const getStoredRefreshToken = async (mobile) => {
  return await redis.get(`refresh:${mobile}`);
};

export const deleteRefreshToken = async (mobile) => {
  await redis.del(`refresh:${mobile}`);
};

/* ------------------------------ Create User ------------------------------ */
export const createOrGetUser = async (mobile) => {
  let [rows] = await db.query(
    "SELECT * FROM user_table WHERE mobile_number = ?",
    [mobile]
  );

  if (rows.length > 0) return rows[0];

  const [result] = await db.query(
    "INSERT INTO user_table (mobile_number, firstname, lastname) VALUES (?, ?, ?)",
    [mobile, "Unknown", "Unknown"]
  );

  const [user] = await db.query("SELECT * FROM user_table WHERE userId = ?", [
    result.insertId,
  ]);
  return user[0];
};
