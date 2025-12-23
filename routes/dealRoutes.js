import express from 'express';
import { createDeal, getDeals, applyDeal } from '../controllers/dealController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getDeals).post(protect, admin, createDeal);
router.post('/apply', applyDeal);

export default router;
