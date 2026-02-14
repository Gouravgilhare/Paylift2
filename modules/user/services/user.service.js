import bcryptConfig from "../../../config/bcrypt.config.js";
import { userModel } from "../models/user.model.js";
import { uploadToGCS } from "../../../config/multer.config.js";

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

  // Hash PIN if provided
  const hashedPin = security_pin
    ? await bcryptConfig.hashPassword(security_pin)
    : null;

  let image_add = null;

  // 🔥 Upload to GCS instead of using file.path
  if (files?.user_image?.[0]) {
    image_add = await uploadToGCS(files.user_image[0]);
  }

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

  // 🔥 Upload new image to GCS if provided
  if (files?.user_image?.[0]) {
    updatedData.image_add = await uploadToGCS(files.user_image[0]);
  }

  // Hash new security pin if provided
  if (updates.security_pin) {
    updatedData.security_pin = await bcryptConfig.hashPassword(
      updates.security_pin,
    );
  }

  const updated = await userModel.updateUser(userId, updatedData);
  return updated;
};
