import express from "express";
import { logDonation, getMyDonations } from "../controllers/donation.controller.js";
import { protectRoute, requireBank } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, requireBank, logDonation);
router.get("/me", protectRoute, getMyDonations);

export default router;