import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const r = await Review.create(req.body);
    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate('userId','name').populate('packageId','title');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
