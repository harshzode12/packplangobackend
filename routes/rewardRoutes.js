import express from 'express';
import { addReward, getRewards } from '../controllers/rewardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getRewards).post(protect, admin, addReward);

export default router;
