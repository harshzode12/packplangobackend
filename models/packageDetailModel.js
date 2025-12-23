// models/packageDetailModel.js
import mongoose from "mongoose";

const packageDetailSchema = new mongoose.Schema(
  {
    packageID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "packageID is required"],
      index: true,
    },

    mainImage: {
      type: String,
      default: "",
    },

    day: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: "",
    },

    imageName: {
      type: String,
      default: "",
    },

    touristPlace: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      min: [1, "rating must be >= 1"],
      max: [5, "rating must be <= 5"],
      default: 4.5,
    },

    review: {
      type: Number, // ✅ changed to numeric type
      min: [0, "review must be >= 0"],
      default: 0,
    },

    imageDetail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

packageDetailSchema.virtual("packageId").get(function () {
  return this.packageID?.toString();
});

const PackageDetail = mongoose.model("PackageDetail", packageDetailSchema);
export default PackageDetail;
