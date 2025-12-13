import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export const hashPassword = async (password) => {
  try {
    if (!password) return null;
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    return hashed;
  } catch (err) {
    console.error("Hashing error:", err.message);
    throw err;
  }
};

/**
 * Compare plain password with hashed password
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    if (!plainPassword || !hashedPassword) return false;
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    console.error("Password compare error:", err.message);
    throw err;
  }
};

export default {
  SALT_ROUNDS,
  hashPassword,
  comparePassword,
};
