import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  createPackageDetail,
  getPackageDetails,
  getPackageDetailById,
  updatePackageDetail,
  deletePackageDetail,
  packageById,
} from "../controllers/packageDetailController.js";

const router = Router();

// 🟢 Create package details — multiple day-wise images
router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 50 },
  ]),
  createPackageDetail
);

// 🟡 Get all
router.get("/", getPackageDetails);

// 🔵 Get one by detail _id
router.get("/:id", getPackageDetailById);

// 🟣 Get all by packageID (grouped by day)
router.get("/packagebyid/:id", packageById);

// 🟠 Update one (image optional)
router.patch(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updatePackageDetail
);

// 🔴 Delete one
router.delete("/:id", deletePackageDetail);

export default router;
