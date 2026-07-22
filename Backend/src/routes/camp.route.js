import express from "express";
import { createCamp, getNearbyCamps } from "../controllers/camp.controller.js";
import { protectRoute, requireBank } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, requireBank, createCamp);
router.get("/", getNearbyCamps);

export default router;