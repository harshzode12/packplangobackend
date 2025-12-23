import mongoose from "mongoose";
import multer from "multer";
import Package from "../models/Package.js";

/* -------------------------------------------------------------------------- */
/*                               Multer Setup                                 */
/* -------------------------------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads" folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

/* -------------------------------------------------------------------------- */
/*                               Helper Methods                               */
/* -------------------------------------------------------------------------- */
const toArray = (val) => {
  if (!val && val !== 0) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [val];
};

const safeNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

/* -------------------------------------------------------------------------- */
/*                               Controller APIs                              */
/* -------------------------------------------------------------------------- */

// ✅ GET all packages
export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate("category", "title").lean();
    const cleaned = packages.map((pkg) => ({
      ...pkg,
      category: pkg.category || { title: "Uncategorized" },
    }));
    res.status(200).json({
      result: "success",
      message: "Packages fetched successfully",
      data: cleaned,
    });
  } catch (err) {
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: [],
    });
  }
};

// ✅ GET packages by type (Domestic or Overseas)
export const getPackagesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const allowedTypes = ["Domestic", "Overseas"];

    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({
        result: "failure",
        message: `Package type is required and must be either 'Domestic' or 'Overseas'`,
        data: [],
      });
    }

    const packages = await Package.find({
      type: { $regex: new RegExp(`^${type}$`, "i") },
    })
      .populate("category", "title")
      .lean();

    const cleaned = packages.map((pkg) => ({
      ...pkg,
      category: pkg.category || { title: "Uncategorized" },
    }));

    res.status(200).json({
      result: "success",
      message: `Packages of type '${type}' fetched successfully`,
      data: cleaned,
    });
  } catch (err) {
    console.error("❌ Fetch packages by type failed:", err);
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: [],
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                ✅ UPDATED: GET packages by category ID                     */
/* -------------------------------------------------------------------------- */
export const getPackagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        result: "failure",
        message: "Category ID is required",
        data: [],
      });
    }

    // Find packages linked to that categoryId
    const packages = await Package.find({ category: categoryId })
      .populate("category", "title")
      .lean();

    if (!packages.length) {
      return res.status(404).json({
        result: "failure",
        message: "No packages found for this category",
        data: [],
      });
    }

    res.status(200).json({
      result: "success",
      message: "Packages fetched successfully for this category",
      data: packages,
    });
  } catch (error) {
    console.error("❌ Error fetching packages by category:", error);
    res
      .status(500)
      .json({ result: "error", message: "Internal Server Error", data: [] });
  }
};

/* -------------------------------------------------------------------------- */
/*                           GET packages shown on home                       */
/* -------------------------------------------------------------------------- */
export const getHomePackages = async (req, res) => {
  try {
    const packages = await Package.find({ showOnHome: true })
      .populate("category", "title")
      .lean();

    if (!packages || packages.length === 0) {
      return res.status(404).json({
        result: "failure",
        message: "No home packages found",
        data: [],
      });
    }

    const cleaned = packages.map((pkg) => ({
      ...pkg,
      category: pkg.category || { title: "Uncategorized" },
    }));

    res.status(200).json({
      result: "success",
      message: "Home packages fetched successfully",
      data: cleaned,
    });
  } catch (err) {
    console.error("❌ Fetch home packages failed:", err);
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: [],
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                CREATE package                              */
/* -------------------------------------------------------------------------- */
export const createPackage = async (req, res) => {
  try {
    const { title, price, rating, review, type, category, country, showOnHome } =
      req.body;

    if (!title || !price) {
      return res.status(400).json({
        result: "failure",
        message: "Title and price are required",
      });
    }

    const pkg = new Package({
      title: title.trim(),
      price: safeNumber(price),
      rating: safeNumber(rating),
      review: review || "",
      type: type?.trim() || "",
      country: country?.trim() || "",
      showOnHome: showOnHome === "true" || showOnHome === true,
      images: req.file ? [req.file.filename] : [],
      category: category || "",
    });

    await pkg.save();

    res.status(201).json({
      result: "success",
      message: "Package created successfully",
      data: pkg,
    });
  } catch (err) {
    console.error("❌ Package creation failed:", err);
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: null,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                UPDATE package                              */
/* -------------------------------------------------------------------------- */
export const updatePackage = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.price !== undefined) updates.price = safeNumber(updates.price);
    if (updates.rating !== undefined) updates.rating = safeNumber(updates.rating);
    if (updates.type) updates.type = updates.type.trim();
    if (updates.country) updates.country = updates.country.trim();
    if (updates.title) updates.title = updates.title.trim();
    if (updates.review) updates.review = updates.review.trim();
    if (req.file) updates.images = [req.file.filename];
    if (updates.showOnHome !== undefined)
      updates.showOnHome = updates.showOnHome === "true" || updates.showOnHome === true;

    const updated = await Package.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        result: "failure",
        message: "Package not found",
        data: null,
      });
    }

    res.status(200).json({
      result: "success",
      message: "Package updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Package update failed:", err);
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: null,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                DELETE package                              */
/* -------------------------------------------------------------------------- */
export const deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        result: "failure",
        message: "Package not found",
        data: null,
      });
    }

    res.status(200).json({
      result: "success",
      message: "Package deleted successfully",
      data: deleted._id,
    });
  } catch (err) {
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: null,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              GET package by ID                             */
/* -------------------------------------------------------------------------- */
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        result: "failure",
        message: "Package ID is required",
        data: null,
      });
    }

    const pkg = await Package.findById(id).populate("category", "title").lean();

    if (!pkg) {
      return res.status(404).json({
        result: "failure",
        message: "Package not found",
        data: null,
      });
    }

    res.status(200).json({
      result: "success",
      message: "Package fetched successfully",
      data: {
        ...pkg,
        category: pkg.category || { title: "Uncategorized" },
      },
    });
  } catch (err) {
    console.error("❌ Fetch package by ID failed:", err);
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: null,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                            ✅ COMPARE PACKAGES                             */
/* -------------------------------------------------------------------------- */
export const getPackagesByIds = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",") || [];
    if (ids.length === 0) {
      return res.status(400).json({
        result: "failure",
        message: "No package IDs provided",
        data: [],
      });
    }

    const packages = await Package.find({ _id: { $in: ids } })
      .populate("category", "title")
      .lean();

    if (packages.length === 0) {
      return res.status(404).json({
        result: "failure",
        message: "No packages found for provided IDs",
        data: [],
      });
    }

    const cleaned = packages.map((pkg) => ({
      ...pkg,
      category: pkg.category || { title: "Uncategorized" },
    }));

    res.status(200).json({
      result: "success",
      message: "Packages fetched successfully for comparison",
      data: cleaned,
    });
  } catch (error) {
    console.error("❌ Error fetching packages by IDs:", error);
    res.status(500).json({
      result: "failure",
      message: "Server error",
      data: [],
    });
  }
};
