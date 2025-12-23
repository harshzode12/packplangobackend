import Reward from '../models/Reward.js';
import User from '../models/User.js';

export const addReward = async (req, res) => {
  try {
    const r = await Reward.create(req.body);
    const user = await User.findById(req.body.userId);
    if (user) {
      user.rewardPoints = (user.rewardPoints || 0) + (req.body.pointsEarned || 0) - (req.body.pointsRedeemed || 0);
      await user.save();
    }
    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({}).populate('userId','name email');
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
