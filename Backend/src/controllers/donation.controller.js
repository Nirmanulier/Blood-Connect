import Donation from "../models/donation.model.js";
import User from "../models/user.model.js";

export const logDonation = async (req, res) => {
  // called by bank when a donor completes a donation
  const { donorId, units = 1 } = req.body;
  try {
    const donation = await Donation.create({
      donor: donorId,
      bloodBank: req.userId,
      units,
    });

    // update donor eligibility + last donation date
    const donor = await User.findById(donorId);
    donor.lastDonationDate = new Date();
    donor.isEligible = false;
    await donor.save();

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.userId })
      .populate("bloodBank", "name")
      .sort({ date: -1 });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};