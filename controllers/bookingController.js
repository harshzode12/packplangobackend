import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
  try {
    const b = await Booking.create(req.body);
    const user = await User.findById(b.userId);
    if (user) {
      user.rewardPoints += Math.floor((b.amountPaid || 0) / 1000);
      await user.save();
    }
    res.status(201).json(b);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('userId','name email').populate('packageId','title price');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id).populate('userId','name email').populate('packageId','title price');
    if (!b) return res.status(404).json({ message: 'Booking not found' });
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b) return res.status(404).json({ message: 'Booking not found' });
    b.bookingStatus = req.body.bookingStatus || b.bookingStatus;
    b.paymentStatus = req.body.paymentStatus || b.paymentStatus;
    await b.save();
    res.json(b);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
