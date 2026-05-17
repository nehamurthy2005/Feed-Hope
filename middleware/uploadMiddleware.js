const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "feedhope",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(
    require("path").extname(file.originalname).toLowerCase()
  );
  const mime = allowed.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;