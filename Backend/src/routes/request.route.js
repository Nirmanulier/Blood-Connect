import express from "express";
import { createRequest, getOpenRequests, fulfillRequest } from "../controllers/request.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createRequest);
router.get("/", getOpenRequests);
router.put("/:id/fulfill", protectRoute, fulfillRequest);

export default router;