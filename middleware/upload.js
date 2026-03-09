// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed (.jpg, .jpeg, .png)"));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// module.exports = upload;

// const multer = require("multer");

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("File type not supported"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// module.exports = upload;



// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const { v2: cloudinary } = require("cloudinary");
// require("dotenv").config();

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "blogs", // change to banners if needed
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//     transformation: [{ width: 500, height: 500, crop: "limit" }],
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;




const multer = require("multer");
 
const storage = multer.memoryStorage();
 
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};
 
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
 
module.exports = upload;