import Camp from "../models/camp.model.js";

export const createCamp = async (req, res) => {
  const { title, lng, lat, address, date, neededGroups } = req.body;
  try {
    const camp = await Camp.create({
      organizedBy: req.userId,
      title,
      location: { type: "Point", coordinates: [lng, lat] },
      address,
      date,
      neededGroups,
    });
    res.status(201).json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNearbyCamps = async (req, res) => {
  const { lng, lat, maxDistance = 20000 } = req.query;
  try {

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const query = { date: { $gte: startOfToday } }; // only upcoming camps

    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      };
    }

    const camps = await Camp.find(query).populate("organizedBy", "name");
    res.status(200).json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};