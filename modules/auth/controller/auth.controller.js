import jwt from "jsonwebtoken";
import {
  generateOtp,
  saveOtp,
  verifyStoredOtp,
  deleteOtp,
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  getStoredRefreshToken,
  deleteRefreshToken,
  createOrGetUser,
} from "../services/auth.service.js";

/* -------------------------------------------------------------------------- */
/*                                Send OTP                                    */
/* -------------------------------------------------------------------------- */

export const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile)
    return res
      .status(400)
      .json({ success: false, message: "Mobile number required" });

  const otp = generateOtp();
  await saveOtp(mobile, otp);

  return res.status(200).json({ success: true, message: "OTP sent", otp });
};

/* -------------------------------------------------------------------------- */
/*                                Verify OTP                                  */
/* -------------------------------------------------------------------------- */

export const verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp)
    return res
      .status(400)
      .json({ success: false, message: "Mobile & OTP required" });

  const storedOtp = await verifyStoredOtp(mobileNumber);

  if (!storedOtp) {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  await deleteOtp(mobileNumber);

  // Auto create user if not exists
  const user = await createOrGetUser(mobileNumber);

  const payload = { userId: user.userId, mobile_number: user.mobile_number };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await storeRefreshToken(mobileNumber, refreshToken);

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    accessToken,
    refreshToken,
    user,
  });
};

/* -------------------------------------------------------------------------- */
/*                         Refresh Access Token                               */
/* -------------------------------------------------------------------------- */

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res
      .status(400)
      .json({ success: false, message: "Refresh token required" });

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });

      const stored = await getStoredRefreshToken(decoded.mobile_number);

      if (!stored || stored !== refreshToken)
        return res.status(403).json({
          success: false,
          message: "Expired refresh token",
        });

      const newAccessToken = generateAccessToken({
        userId: decoded.userId,
        mobile_number: decoded.mobile_number,
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    }
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Logout                                   */
/* -------------------------------------------------------------------------- */

export const logout = async (req, res) => {
  const mobile = req.user.mobileNumber;

  await deleteRefreshToken(mobile);

  return res.status(200).json({ success: true, message: "Logged out" });
};
