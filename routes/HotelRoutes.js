import express from "express";
import { createHotel, getHotels, getHotelById, updateHotel, deleteHotel } from "../controllers/HotelController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createHotel);
router.get("/", getHotels);
router.get("/:id", getHotelById);
router.put("/:id", protect, admin, updateHotel);
router.delete("/:id", protect, admin, deleteHotel);

export default router;
