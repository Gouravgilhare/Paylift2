import {
  getRiderByIdService,
  getRiderByUserIdService,
  createRiderService,
  updateRiderService,
  deleteRiderService,
} from "../services/rider.service.js";

// GET Rider by ID
export const getRiderById = async (req, res) => {
  try {
    const rider = await getRiderByIdService(req.params.riderid);

    if (!rider) return res.status(404).json({ message: "Rider not found" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    if (rider.dl_image) rider.dl_image = `${baseUrl}/${rider.dl_image}`;

    res.status(200).json({ rider });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET Rider by UserId
export const getRiderByUserId = async (req, res) => {
  try {
    const rider = await getRiderByUserIdService(req.params.userid);
    if (!rider) return res.status(404).json({ message: "Rider not found" });
    res.status(200).json({ rider });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CREATE Rider
export const createRider = async (req, res) => {
  try {
    const newRider = await createRiderService(req.body, req.files);
    res
      .status(201)
      .json({ message: "Rider registered successfully", newRider });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// UPDATE Rider
export const updateRider = async (req, res) => {
  try {
    const updated = await updateRiderService(
      req.params.riderid,
      req.body,
      req.files
    );

    if (!updated) return res.status(404).json({ message: "Rider not found" });

    res.status(200).json({ message: "Rider updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE Rider
export const deleteRider = async (req, res) => {
  try {
    const deleted = await deleteRiderService(req.params.riderid);

    if (!deleted) return res.status(404).json({ message: "Rider not found" });

    res.status(200).json({ message: "Rider deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
