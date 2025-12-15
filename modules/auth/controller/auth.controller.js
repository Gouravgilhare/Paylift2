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
export const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({
      success: false,
      message: "Mobile number required",
    });
  }

  const otp = generateOtp();
  await saveOtp(`user_${mobile}`, otp);

  return res.status(200).json({
    success: true,
    message: "OTP sent",
    otp, // ⚠️ remove in production
  });
};

/* -------------------------------------------------------------------------- */
/*                                USER: VERIFY OTP                            */
/* -------------------------------------------------------------------------- */
export const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({
      success: false,
      message: "Mobile & OTP required",
    });
  }

  const storedOtp = await verifyStoredOtp(`user_${mobile}`);

  if (!storedOtp) {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  await deleteOtp(`user_${mobile}`);

  const user = await createOrGetUser(mobile);

  const payload = {
    userId: user.userId,
    mobile_number: user.mobile_number,
    role: "user",
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await storeRefreshToken(`user_${mobile}`, refreshToken);

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    accessToken,
    refreshToken,
    user,
  });
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
