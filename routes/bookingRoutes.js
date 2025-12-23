import express from 'express';
import { createBooking, getBookings, getBookingById, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createBooking).get(protect, admin, getBookings);
router.route('/:id').get(protect, admin, getBookingById).put(protect, admin, updateBookingStatus);

export default router;
