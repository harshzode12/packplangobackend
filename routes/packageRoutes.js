import express from "express";
import multer from "multer";
import {
  getPackages,
  getPackagesByType,
  getPackageById,
  getPackagesByCategory,
  getHomePackages,
  createPackage,
  updatePackage,
  deletePackage,
  getPackagesByIds, // ✅ for comparison feature
  upload,
} from "../controllers/packageController.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                               Multer Setup                                 */
/* -------------------------------------------------------------------------- */
// If you already use `upload` from controller, skip this redefinition.
// But if you prefer local setup, uncomment below lines:

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

/* -------------------------------------------------------------------------- */
/*                               Package Routes                               */
/* -------------------------------------------------------------------------- */

// ✅ Get all packages
router.get("/", getPackages);

// ✅ Get packages by type (Domestic / Overseas)
router.get("/type/:type", getPackagesByType);

// ✅ Get packages by category (using categoryId)
router.get("/category/:categoryId", getPackagesByCategory);

// ✅ Compare multiple packages by IDs (e.g., /compare?ids=abc,def,ghi)
router.get("/compare", getPackagesByIds);

// ✅ Get packages marked as showOnHome = true
router.get("/home", getHomePackages);

// ✅ Create a new package
router.post("/", upload.single("image"), createPackage);

// ✅ Update a package by ID
router.put("/:id", upload.single("image"), updatePackage);

// ✅ Delete a package by ID
router.delete("/:id", deletePackage);

// ✅ Get single package by ID
router.get("/byid/:id", getPackageById);

export default router;
