import express from "express";
import { searchDonors, updateLocation, updateDonationDate } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", searchDonors);
router.put("/location", protectRoute, updateLocation);
router.put("/donate", protectRoute, updateDonationDate);

export default router;