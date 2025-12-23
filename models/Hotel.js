import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true }
  },
  address: { type: String },
  description: { type: String },
  images: [{ type: String }],
  amenities: [{ type: String }], // e.g. ["WiFi", "Pool", "Gym"]
  rooms: [
    {
      roomType: { type: String, required: true }, // Deluxe, Suite, etc.
      pricePerNight: { type: Number, required: true },
      maxGuests: { type: Number, required: true },
      available: { type: Boolean, default: true }
    }
  ],
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
