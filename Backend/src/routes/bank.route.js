import express from "express";
import { updateInventory, getMyInventory, searchBanks , verifyBank } from "../controllers/bank.controller.js";
import { protectRoute, requireBank } from "../middleware/auth.middleware.js";
import { broadcastUrgentNeed } from "../controllers/broadcast.controller.js";
import { updateBankLocation } from "../controllers/bank.controller.js";

const router = express.Router();

router.put("/inventory", protectRoute, requireBank, updateInventory);
router.get("/inventory/me", protectRoute, requireBank, getMyInventory);
router.get("/search", searchBanks);
router.put("/:id/verify", verifyBank);
router.post("/broadcast", protectRoute, requireBank, broadcastUrgentNeed);
router.put("/location", protectRoute, requireBank, updateBankLocation);

export default router;