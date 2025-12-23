import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String }, // store image URL
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
