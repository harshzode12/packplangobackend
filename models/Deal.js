import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['flat','percentage'], required: true },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  applicablePackages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
  usageLimit: { type: Number, default: 1 },
  status: { type: String, enum: ['active','expired'], default: 'active' }
}, { timestamps: true });

const Deal = mongoose.model('Deal', dealSchema);
export default Deal;
