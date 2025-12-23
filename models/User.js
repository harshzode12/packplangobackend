import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    preferences: [{ type: String }],
    rewardPoints: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
