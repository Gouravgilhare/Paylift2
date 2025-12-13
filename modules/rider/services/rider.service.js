import { riderModel } from "../models/rider.model.js";

export const getRiderByIdService = async (riderId) => {
  return await riderModel.getRiderById(riderId);
};

export const getRiderByUserIdService = async (userId) => {
  return await riderModel.getRiderByUserId(userId);
};

export const createRiderService = async (riderData, files) => {
  const dl_image = files?.dl_image?.[0]?.path || null;

  return await riderModel.createRider({
    userId: riderData.userId,
    driving_license: riderData.driving_license,
    dl_image,
  });
};

export const updateRiderService = async (riderId, updates, files) => {
  const dl_image = files?.dl_image?.[0]?.path || updates.dl_image;
  const is_active = updates.is_active ?? 1;

  const updated = await riderModel.updateRider(riderId, {
    driving_license: updates.driving_license,
    dl_image,
    is_active,
  });

  return updated;
};

export const deleteRiderService = async (riderId) => {
  return await riderModel.deleteRider(riderId);
};
