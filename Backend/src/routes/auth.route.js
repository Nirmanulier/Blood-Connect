import express from "express";
import { signupDonor, signupBank, login, logout } from "../controllers/auth.controller.js";
import { protectRoute, } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup/donor", signupDonor);
router.post("/signup/bank", signupBank);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

export default router;