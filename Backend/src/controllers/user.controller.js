import User from "../models/user.model.js";

export const searchDonors = async (req, res) => {
  const { bloodGroup, lng, lat, maxDistance = 10000 } = req.query;
  // maxDistance is in meters (default 10km)

  try {
    const query = {
      isEligible: true,
    };

    if (bloodGroup) query.bloodGroup = bloodGroup;

    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      };
    }


    const donors = await User.find(query).select("-password");
    for (const donor of donors) {
        const eligible = donor.checkEligibility();
        if (donor.isEligible !== eligible) {
            donor.isEligible = eligible;
            await donor.save();
        }
    }
    res.status(200).json(donors.filter((d) => d.isEligible));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  const { lng, lat } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { location: { type: "Point", coordinates: [lng, lat] } },
      { new: true }
    ).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonationDate = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.lastDonationDate = new Date();
    user.isEligible = false; // becomes eligible again after 90 days — checked on read
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};