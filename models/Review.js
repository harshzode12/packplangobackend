import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewText: { type: String },
  reviewDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['approved','pending','rejected'], default: 'pending' }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
