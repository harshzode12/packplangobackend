// models/TouristPlace.js
import mongoose from "mongoose";

const touristPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

export default mongoose.model("TouristPlace", touristPlaceSchema);
