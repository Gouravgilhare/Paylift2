import bcryptConfig from "../../../config/bcrypt.config.js";
import { userModel } from "../models/user.model.js";

// Multer is used in your ROUTE, not inside service.
// So no need to import multer here.

/* ------------------------------ Get User By ID ------------------------------ */
export const getUserByIdService = async (userId) => {
  const user = await userModel.getUserById(userId);
  return user;
};

/* ------------------------------ Register User ------------------------------ */
export const registerUserService = async (userInput, files) => {
  const {
    firstname,
    lastname,
    gender,
    dob,
    aadhar,
    mobile_number,
    email,
    security_pin,
    status = "active",
  } = userInput;

  // Hash PIN only if provided
  const hashedPin = security_pin
    ? await bcryptConfig.hashPassword(security_pin)
    : null;

  // Get file path from Multer
  const image_add = files?.user_image?.[0]?.path || null;

  const newUser = await userModel.createUser({
    firstname,
    lastname,
    gender,
    dob,
    aadhar,
    mobile_number,
    email,
    image_add,
    security_pin: hashedPin,
    status,
  });

  return newUser;
};

/* ------------------------------ Delete User ------------------------------ */
export const deleteUserByIdService = async (userId) => {
  const deleted = await userModel.deleteUser(userId);
  return deleted;
};

/* ------------------------------ Update User ------------------------------ */
export const updateUserByIdService = async (userId, updates, files) => {
  let updatedData = { ...updates };

  // Only update image if a new file is uploaded
  if (files?.user_image?.[0]?.path) {
    updatedData.image_add = files.user_image[0].path;
  }

  // Hash new security pin if provided
  if (updates.security_pin) {
    updatedData.security_pin = await bcryptConfig.hashPassword(
      updates.security_pin
    );
  }

  const updated = await userModel.updateUser(userId, updatedData);
  return updated;
};
