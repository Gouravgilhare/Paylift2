import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // Expecting format → "Bearer <token>"
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err.message);

        return res.status(403).json({
          success: false,
          message:
            err.name === "TokenExpiredError"
              ? "Token expired"
              : "Invalid token",
        });
      }

      // Inject user payload into `req.user`
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying token",
    });
  }
};
