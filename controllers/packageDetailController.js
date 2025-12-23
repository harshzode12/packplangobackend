// controllers/packageDetailController.js
import PackageDetail from "../models/packageDetailModel.js";

/**
 * Helper: normalize files from Multer (single or multiple field names)
 */
function collectUploadedFiles(filesOrObj) {
  if (!filesOrObj) return [];
  if (Array.isArray(filesOrObj)) return filesOrObj;
  return Object.values(filesOrObj).flat();
}

/**
 * 🟢 CREATE — Add new package details (supports multiple images per day)
 */
export const createPackageDetail = async (req, res) => {
  try {
    const { packageID, days } = req.body;

    if (!packageID)
      return res.status(400).json({
        result: "failure",
        message: "packageID is required",
      });

    if (!days)
      return res.status(400).json({
        result: "failure",
        message: "days array is missing",
      });

    let parsedDays;
    try {
      parsedDays = JSON.parse(days);
    } catch {
      return res.status(400).json({
        result: "failure",
        message: "Invalid days format (must be valid JSON array)",
      });
    }

    // 🧠 Prevent duplicate creation for same packageID if already exists
    const existingDetails = await PackageDetail.find({ packageID });
    if (existingDetails.length > 0) {
      return res.status(400).json({
        result: "failure",
        message:
          "Package details already exist for this package. Please update or delete first.",
      });
    }

    // 🖼️ Handle uploaded files
    const mainImageFile = req.files?.mainImage?.[0];
    const uploadedImages = collectUploadedFiles(req.files?.images);
    const mainImageUrl = mainImageFile
      ? `/uploads/packages/${mainImageFile.filename}`
      : "";

    // 🔁 Flatten days[*].images[*]
    const newDocs = [];
    let imageIndex = 0;

    for (const day of parsedDays) {
      const dayNumber = Number(day.dayNumber) || newDocs.length + 1;

      for (const imgData of day.images || []) {
        const file = uploadedImages[imageIndex++];

        newDocs.push({
          packageID,
          day: dayNumber,
          mainImage: mainImageUrl,
          image: file ? `/uploads/packages/${file.filename}` : "",
          imageName: imgData.imageName?.trim() || `Image ${imageIndex}`,
          touristPlace: imgData.touristPlace?.trim() || "",
          rating: Number(imgData.rating) || 0,
          review: Number(imgData.review) || 0,
          imageDetail: imgData.imageDetail?.trim() || "",
        });
      }
    }

    if (newDocs.length === 0) {
      return res.status(400).json({
        result: "failure",
        message: "No image data found to create package details",
      });
    }

    const created = await PackageDetail.insertMany(newDocs);

    res.status(201).json({
      result: "success",
      message: "Package details created successfully",
      data: created,
    });
  } catch (error) {
    console.error("❌ Error creating package detail:", error);
    res.status(500).json({
      result: "failure",
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * 🟡 READ — Get all package details (with pagination)
 */
export const getPackageDetails = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit ?? "20", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.packageID) filter.packageID = req.query.packageID;

    const [items, total] = await Promise.all([
      PackageDetail.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PackageDetail.countDocuments(filter),
    ]);

    res.status(200).json({
      result: "success",
      page,
      limit,
      total,
      data: items,
    });
  } catch (err) {
    res.status(500).json({ result: "failure", message: err.message });
  }
};

/**
 * 🔵 READ — Get single package detail by _id
 */
export const getPackageDetailById = async (req, res) => {
  try {
    const doc = await PackageDetail.findById(req.params.id);
    if (!doc)
      return res
        .status(404)
        .json({ result: "failure", message: "Package detail not found" });

    res.status(200).json({ result: "success", data: doc });
  } catch (err) {
    res.status(500).json({ result: "failure", message: err.message });
  }
};

/**
 * 🟣 READ — Get all package details by packageID, grouped by day
 */
export const packageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ result: "failure", message: "Package ID is required" });

    const details = await PackageDetail.find({ packageID: id }).sort({
      day: 1,
    });

    if (!details || details.length === 0) {
      return res.status(404).json({
        result: "failure",
        message: "No package details found for this package",
        data: [],
      });
    }

    // ✅ Group by day
    const grouped = details.reduce((acc, item) => {
      const day = item.day || 1;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

    res.status(200).json({ result: "success", data: grouped });
  } catch (err) {
    console.error("❌ packageById error:", err);
    res.status(500).json({
      result: "failure",
      message: err.message,
      data: null,
    });
  }
};

/**
 * 🟠 UPDATE — Update single record
 */
export const updatePackageDetail = async (req, res) => {
  try {
    const files = collectUploadedFiles(req.files);
    const newImageUrl = files[0]
      ? `/uploads/packages/${files[0].filename}`
      : undefined;

    const payload = { ...req.body };
    if (newImageUrl) payload.image = newImageUrl;

    const updated = await PackageDetail.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ result: "failure", message: "Package detail not found" });

    res
      .status(200)
      .json({ result: "success", message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(400).json({ result: "failure", message: err.message });
  }
};

/**
 * 🔴 DELETE — Delete package detail
 */
export const deletePackageDetail = async (req, res) => {
  try {
    const deleted = await PackageDetail.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ result: "failure", message: "Package detail not found" });

    res.status(200).json({
      result: "success",
      message: "Package detail deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ result: "failure", message: err.message });
  }
};
