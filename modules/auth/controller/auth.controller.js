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

const twilioClient = require("../config/twilio");

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                Verify OTP                                  */
/* -------------------------------------------------------------------------- */

const jwt = require("jsonwebtoken");
const twilioClient = require("../config/twilio");

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (verification.status !== "approved") {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // TODO: find or create user in DB
    const user = { id: 1, phone };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
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
