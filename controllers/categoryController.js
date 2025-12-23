import Category from "../models/Category.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { BASE_URL } from "../server.js";

/* -------------------------------------------------------------------------- */
/*                               Multer Setup                                 */
/* -------------------------------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

/* -------------------------------------------------------------------------- */
/*                                 Controllers                                */
/* -------------------------------------------------------------------------- */

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ result: "success", data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get category
export const getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const categories = await Category.findById(id);
    res.status(200).json({ result: "success", data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ Create new category
export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    const imagePath = req.file ? `${BASE_URL}/uploads/${req.file.filename}` : "";

    const newCategory = new Category({ title, image: imagePath });
    await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    if (title) category.title = title;

    // Replace image if new one uploaded
    if (req.file) {
      // delete old image if exists
      if (category.image) {
        const oldFile = category.image.split("/uploads/")[1];
        if (oldFile) {
          const oldPath = path.join(process.cwd(), "uploads", oldFile);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      category.image = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    await category.save();
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    // Delete file if exists
    if (category.image) {
      const fileName = category.image.split("/uploads/")[1];
      if (fileName) {
        const filePath = path.join(process.cwd(), "uploads", fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
