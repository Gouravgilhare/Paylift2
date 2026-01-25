import jwt from "jsonwebtoken";
import twilioClient from "../../../config/twilio.js";
import "../../../config/env.config.js";
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
  getAdminByMobile,
} from "../services/auth.service.js";
import AccessToken from "twilio/lib/jwt/AccessToken.js";

/* -------------------------------------------------------------------------- */
/*                                USER: SEND OTP                              */
/* -------------------------------------------------------------------------- */

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // Validate E.164 format: +1234567890
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be in E.164 format (e.g., +12345678900)",
      });
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

export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: mobile,
        code: otp,
      });

    if (verification.status !== "approved") {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const user = await createOrGetUser(mobile);

    const payload = {
      userId: user.userId,
      mobile: user.mobile_number,
      role: "user",
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await storeRefreshToken(`user_${mobile}`, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        userId: user.userId,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile: user.mobile_number,
      },
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
        `user_${decoded.mobile_number}`,
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
    },
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
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Admin mobile number required",
      });
    }

    // Validate E.164 format: +1234567890
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be in E.164 format (e.g., +12345678900)",
      });
    }

    const admin = await getAdminByMobile(mobile);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: mobile,
        channel: "sms",
      });

    return res.status(200).json({
      success: true,
      message: "Admin OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

/* ========================================================================== */
/*                               ADMIN: VERIFY OTP                            */
/* ========================================================================== */
export const verifyAdminOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile & OTP required",
      });
    }

    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: mobile,
        code: otp,
      });

    if (verification.status !== "approved") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const admin = await getAdminByMobile(mobile);

    const payload = {
      adminId: admin.adminId,
      mobile: admin.mobile,
      role: admin.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await storeRefreshToken(`admin_${mobile}`, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Admin authenticated",
      accessToken,
      refreshToken,
      admin: {
        adminId: admin.adminId,
        firstname: admin.firstname,
        lastname: admin.lastname,
        mobile: admin.mobile,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
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

      const stored = await getStoredRefreshToken(`admin_${decoded.mobile}`);

      if (!stored || stored !== refreshToken) {
        return res.status(403).json({
          success: false,
          message: "Expired refresh token",
        });
      }

      const newAccessToken = generateAccessToken({
        adminId: decoded.adminId,
        mobile: decoded.mobile,
        role: decoded.role,
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    },
  );
};

/* ========================================================================== */
/*                                ADMIN: LOGOUT                               */
/* ========================================================================== */
export const adminLogout = async (req, res) => {
  await deleteRefreshToken(`admin_${req.user.mobile}`);

  return res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};
