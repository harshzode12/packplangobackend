import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pointsEarned: { type: Number, default: 0 },
  pointsRedeemed: { type: Number, default: 0 },
  pointsBalance: { type: Number, default: 0 },
  transactionDate: { type: Date, default: Date.now },
  reason: { type: String }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
