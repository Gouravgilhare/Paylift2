import {
  getUserByIdService,
  registerUserService,
  deleteUserByIdService,
  updateUserByIdService,
} from "../services/user.service.js";

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Do NOT modify image URL (GCS already gives full URL)
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const newUser = await registerUserService(req.body, req.files);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const deleted = await deleteUserByIdService(req.params.userid);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const updated = await updateUserByIdService(
      req.params.userid,
      req.body,
      req.files,
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
