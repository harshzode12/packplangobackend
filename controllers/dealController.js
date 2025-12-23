import Deal from '../models/Deal.js';

export const createDeal = async (req, res) => {
  try {
    const d = await Deal.create(req.body);
    res.status(201).json(d);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDeals = async (req, res) => {
  try {
    const deals = await Deal.find({});
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyDeal = async (req, res) => {
  try {
    const { code } = req.body;
    const deal = await Deal.findOne({ code, status: 'active', validFrom: { $lte: new Date() }, validTo: { $gte: new Date() } });
    if (!deal) return res.status(404).json({ message: 'Deal not found or expired' });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
