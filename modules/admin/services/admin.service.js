// modules/admin/services/admin.service.js

import * as adminModel from "../models/admin.model.js";
import * as userModel from "../../user/models/user.model.js";
import * as riderModel from "../../rider/models/rider.model.js";
import * as vehicleModel from "../../vehicle/models/vehicle.model.js";
import * as tripModel from "../../trips/models/trip.model.js";
import bcrypt from "bcryptjs";

/* ------------------ Admin CRUD ------------------ */

// Create new admin
export const createAdmin = async ({
  firstname,
  lastname,
  email,
  password,
  role,
}) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  return await adminModel.createAdmin({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role,
  });
};

// Get admin by email
export const getAdminByEmail = async (email) => {
  return await adminModel.getAdminByEmail(email);
};

// Get admin by ID
export const getAdminById = async (adminId) => {
  return await adminModel.getAdminById(adminId);
};

// Get all admins
export const getAllAdmins = async () => {
  return await adminModel.getAllAdmins();
};

// Update admin details
export const updateAdmin = async (adminId, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return await adminModel.updateAdmin(adminId, data);
};

// Delete admin
export const deleteAdmin = async (adminId) => {
  return await adminModel.deleteAdmin(adminId);
};

/* ------------------ Analytics / Dashboard ------------------ */

export const getDashboardStats = async () => {
  const totalUsers = await adminModel.countUsers();
  const totalRiders = await adminModel.countRiders();
  const totalVehicles = await adminModel.countVehicles();
  const totalTrips = await adminModel.countTrips();
  const totalRevenue = await adminModel.sumRevenue();

  return { totalUsers, totalRiders, totalVehicles, totalTrips, totalRevenue };
};

/* ------------------ List / Fetch All ------------------ */

export const getAllUsers = async () => {
  return await adminModel.getAllUsers();
};

export const getAllRiders = async () => {
  return await adminModel.getAllRiders();
};

export const getAllVehicles = async () => {
  return await adminModel.getAllVehicles();
};

export const getAllTrips = async () => {
  return await adminModel.getAllTrips();
};
