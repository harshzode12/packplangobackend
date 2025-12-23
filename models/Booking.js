import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  numberOfTravelers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 }
  },
  travelDates: {start: Date, end: Date },
  bookingDate: { type: Date, default: Date.now },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card','upi','paypal','netbanking'], default: 'card' },
  paymentStatus: { type: String, enum: ['pending','confirmed','refunded'], default: 'pending' },
  bookingStatus: { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
