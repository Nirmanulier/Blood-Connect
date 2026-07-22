import Request from "../models/request.model.js";
import User from "../models/user.model.js";

export const createRequest = async (req, res) => {
  const { bloodGroup, urgency, lng, lat } = req.body;
  try {
    const request = await Request.create({
      requestedBy: req.userId,
      bloodGroup,
      urgency,
      location: { type: "Point", coordinates: [lng, lat] },
    });

    // find matching donors nearby (within 15km) for this blood group
    const matchingDonors = await User.find({
      bloodGroup,
      isEligible: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 15000,
        },
      },
    }).select("-password");

    res.status(201).json({ request, matchingDonors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOpenRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "open" }).populate("requestedBy", "name email");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fulfillRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "fulfilled" },
      { new: true }
    );
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};