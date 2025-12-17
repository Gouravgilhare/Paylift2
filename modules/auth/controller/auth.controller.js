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
  getAdminByEmail,
} from "../services/auth.service.js";

/* -------------------------------------------------------------------------- */
/*                                USER: SEND OTP                              */
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
/*                                USER: VERIFY OTP                            */
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
/*                          USER: REFRESH ACCESS TOKEN                        */
/* -------------------------------------------------------------------------- */
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token required",
    });
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const stored = await getStoredRefreshToken(
        `user_${decoded.mobile_number}`
      );

      if (!stored || stored !== refreshToken) {
        return res.status(403).json({
          success: false,
          message: "Expired refresh token",
        });
      }

      const newAccessToken = generateAccessToken({
        userId: decoded.userId,
        mobile_number: decoded.mobile_number,
        role: "user",
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    }
  );
};

/* -------------------------------------------------------------------------- */
/*                                USER: LOGOUT                                */
/* -------------------------------------------------------------------------- */
export const logout = async (req, res) => {
  const mobile = req.user.mobile_number;
  await deleteRefreshToken(`user_${mobile}`);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/* ========================================================================== */
/*                                ADMIN: SEND OTP                             */
/* ========================================================================== */
export const sendAdminOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Admin email required",
    });
  }

  const admin = await getAdminByEmail(email);
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  const otp = generateOtp();
  await saveOtp(`admin_${email}`, otp);

  return res.status(200).json({
    success: true,
    message: "Admin OTP sent",
    otp, // ⚠️ remove in production
  });
};

/* ========================================================================== */
/*                               ADMIN: VERIFY OTP                            */
/* ========================================================================== */
export const verifyAdminOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email & OTP required",
    });
  }

  const storedOtp = await verifyStoredOtp(`admin_${email}`);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  await deleteOtp(`admin_${email}`);

  const admin = await getAdminByEmail(email);

  const payload = {
    adminId: admin.adminId,
    email: admin.email,
    role: admin.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await storeRefreshToken(`admin_${admin.adminId}`, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Admin authenticated",
    accessToken,
    refreshToken,
    admin: {
      adminId: admin.adminId,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      role: admin.role,
    },
  });
};

/* ========================================================================== */
/*                           ADMIN: REFRESH TOKEN                             */
/* ========================================================================== */
export const adminRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token required",
    });
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const stored = await getStoredRefreshToken(`admin_${decoded.adminId}`);

      if (!stored || stored !== refreshToken) {
        return res.status(403).json({
          success: false,
          message: "Expired refresh token",
        });
      }

      const newAccessToken = generateAccessToken({
        adminId: decoded.adminId,
        email: decoded.email,
        role: decoded.role,
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    }
  );
};

/* ========================================================================== */
/*                                ADMIN: LOGOUT                               */
/* ========================================================================== */
export const adminLogout = async (req, res) => {
  await deleteRefreshToken(`admin_${req.user.adminId}`);

  return res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};
