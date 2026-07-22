import BloodBank from "../models/bloodbank.model.js";

export const updateInventory = async (req, res) => {
  const { bloodGroup, units } = req.body; // units = new count for that group
  try {
    const bank = await BloodBank.findById(req.userId);
    if (!bank) return res.status(404).json({ message: "Bank not found" });

    bank.inventory[bloodGroup] = units;
    await bank.save();

    res.status(200).json(bank.inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyInventory = async (req, res) => {
  try {
    const bank = await BloodBank.findById(req.userId).select("-password");
    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBanks = async (req, res) => {
  const { bloodGroup, lng, lat, maxDistance = 15000 } = req.query;
  try {
    const query = { verified: true };
    if (bloodGroup) query[`inventory.${bloodGroup}`] = { $gt: 0 };

    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      };
    }

    const banks = await BloodBank.find(query).select("-password");
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBankLocation = async (req, res) => {
  const { lng, lat } = req.body;
  try {
    const bank = await BloodBank.findByIdAndUpdate(
      req.userId,
      { location: { type: "Point", coordinates: [lng, lat] } },
      { returnDocument: "after" }
    ).select("-password");
    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//manual way for check admin gated verification
export const verifyBank = async (req, res) => {
  // in production you'd check req.role === "admin" here
  try {
    const bank = await BloodBank.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};