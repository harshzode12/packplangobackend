import mongoose from "mongoose";

const imageDetailSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  imageName: { type: String, required: true },
  rating: { type: Number, default: 0 },
  review: { type: Number, default: 0 },
  details: { type: String, default: "" },
});

const dayDetailSchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  images: [imageDetailSchema],
});

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    mainImage: { type: String }, // ✅ main image for the package
    rating: { type: Number, default: 0 },
    review: { type: String },
    type: {
      type: String,
      enum: ["Domestic", "Overseas"],
      required: true,
      default: "Domestic",
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    country: { type: String, required: true },
    showOnHome: { type: Boolean, default: false },
    days: { type: Number, default: 1 }, // ✅ total days
    details: [dayDetailSchema], // ✅ new structure for day-wise details
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);
export default Package;
