import TouristPlace from '../models/TouristPlace.js';

// Get all tourist places
export const getTouristPlaces = async (req, res) => {
  try {
    const places = await TouristPlace.find().populate('state');
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single tourist place
export const getTouristPlaceById = async (req, res) => {
  try {
    const place = await TouristPlace.findById(req.params.id).populate('state');
    if (!place) return res.status(404).json({ message: 'Tourist Place not found' });
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new tourist place
export const createTouristPlace = async (req, res) => {
  try {
    const place = new TouristPlace(req.body);
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tourist place
export const updateTouristPlace = async (req, res) => {
  try {
    const updatedPlace = await TouristPlace.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete tourist place
export const deleteTouristPlace = async (req, res) => {
  try {
    await TouristPlace.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tourist Place deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
