import express from "express";
import multer from "multer";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  upload,
} from "../controllers/categoryController.js";
import { getPackagesByCategory } from "../controllers/packageController.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                           Packages by Category ID                          */
/* -------------------------------------------------------------------------- */

// ✅ Place this FIRST — so Express matches it before /:id
router.get("/category/:categoryId", getPackagesByCategory);

/* -------------------------------------------------------------------------- */
/*                               Category Routes                              */
/* -------------------------------------------------------------------------- */

// ✅ Get all categories
router.get("/", getCategories);

// ✅ Get single category by ID
router.get("/:id", getCategory);

// ✅ Create new category (with image upload)
router.post("/", upload.single("image"), createCategory);

// ✅ Update category
router.put("/:id", upload.single("image"), updateCategory);

// ✅ Delete category
router.delete("/:id", deleteCategory);

export default router;
